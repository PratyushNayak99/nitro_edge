import { access, readFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type DiagnosticStatus = 'healthy' | 'degraded' | 'unavailable' | 'error';
export type ErrorCode =
  | 'command_unavailable'
  | 'hardware_not_present'
  | 'service_manager_unavailable'
  | 'permission_denied'
  | 'command_timed_out'
  | 'unexpected_execution_failure';

export interface Observation {
  code: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  evidence?: Record<string, string | number | boolean>;
}

export interface DiagnosticResult {
  status: DiagnosticStatus;
  summary: string;
  capabilities: Record<string, boolean>;
  observations: Observation[];
  remediation: string[];
  execution: {
    mode: 'host' | 'simulation';
    strategy: string;
    elapsed_ms: number;
  };
  error?: ErrorCode;
}

export interface CommandRunner {
  findExecutable(name: string): Promise<string | undefined>;
  run(file: string, args: readonly string[]): Promise<{ stdout: string; stderr: string }>;
  readText(path: string): Promise<string>;
  listDirectory(path: string): Promise<string[]>;
}

export interface Capabilities extends Record<string, boolean> {
  systemctl: boolean;
  service: boolean;
  nmcli: boolean;
  ip: boolean;
  rfkill: boolean;
  network_sysfs: boolean;
  bluetooth_sysfs: boolean;
  proc_telemetry: boolean;
  kernel_logs: boolean;
}

const COMMAND_TIMEOUT_MS = 4_000;
const MAX_BUFFER_BYTES = 64 * 1024;
const remediationFor: Record<ErrorCode, string[]> = {
  command_unavailable: ['Install or enable the required diagnostic utility, then run the check again.'],
  hardware_not_present: ['Verify that the hardware is connected and enabled before retrying this check.'],
  service_manager_unavailable: ['Use a host with systemctl or service support to inspect or restart allowlisted services.'],
  permission_denied: ['Grant only the minimum read permission required for this diagnostic, then retry.'],
  command_timed_out: ['Check host load and retry the read-only diagnostic when the system is responsive.'],
  unexpected_execution_failure: ['Review server-side diagnostic logs and retry after correcting the host condition.'],
};

function normaliseError(error: unknown): ErrorCode {
  const value = error as NodeJS.ErrnoException & { killed?: boolean; signal?: string };
  if (value?.code === 'EACCES' || value?.code === 'EPERM') return 'permission_denied';
  if (value?.code === 'ENOENT') return 'command_unavailable';
  if (value?.code === 'ETIMEDOUT' || value?.killed || value?.signal === 'SIGTERM') return 'command_timed_out';
  return 'unexpected_execution_failure';
}

class HostCommandRunner implements CommandRunner {
  async findExecutable(name: string) {
    for (const directory of (process.env.PATH ?? '').split(':').filter(Boolean)) {
      const candidate = `${directory}/${name}`;
      try {
        await access(candidate, constants.X_OK);
        return candidate;
      } catch {
        // Continue searching PATH without surfacing host details.
      }
    }
    return undefined;
  }

  async run(file: string, args: readonly string[]) {
    const { stdout, stderr } = await execFileAsync(file, [...args], {
      timeout: COMMAND_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER_BYTES,
      windowsHide: true,
    });
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  }

  readText(path: string) {
    return readFile(path, 'utf8');
  }

  listDirectory(path: string) {
    return readdir(path);
  }
}

type Scenario = 'nominal' | 'network-down' | 'bluetooth-blocked' | 'service-failed' | 'minimal-host';
const SCENARIOS: Scenario[] = ['nominal', 'network-down', 'bluetooth-blocked', 'service-failed', 'minimal-host'];

export class DiagnosticsPlatform {
  private readonly runner: CommandRunner;
  private capabilities: Capabilities | undefined;
  private readonly simulation = process.env.EDGE_SENTINEL_MODE === 'simulation';
  private readonly scenario: Scenario = SCENARIOS.includes(process.env.EDGE_SENTINEL_SCENARIO as Scenario)
    ? process.env.EDGE_SENTINEL_SCENARIO as Scenario
    : 'nominal';

  constructor(runner: CommandRunner = new HostCommandRunner()) {
    this.runner = runner;
  }

  async onModuleInit() {
    await this.refreshCapabilities();
  }

  async refreshCapabilities(): Promise<Capabilities> {
    if (this.simulation) {
      this.capabilities = this.simulatedCapabilities();
      return this.capabilities;
    }
    const readable = async (path: string) => {
      try { await access(path, constants.R_OK); return true; } catch { return false; }
    };
    const directory = async (path: string) => {
      try { await readdir(path); return true; } catch { return false; }
    };
    this.capabilities = {
      systemctl: Boolean(await this.runner.findExecutable('systemctl')),
      service: Boolean(await this.runner.findExecutable('service')),
      nmcli: Boolean(await this.runner.findExecutable('nmcli')),
      ip: Boolean(await this.runner.findExecutable('ip')),
      rfkill: Boolean(await this.runner.findExecutable('rfkill')),
      network_sysfs: await directory('/sys/class/net'),
      bluetooth_sysfs: await directory('/sys/class/bluetooth'),
      proc_telemetry: await readable('/proc/uptime') && await readable('/proc/loadavg'),
      kernel_logs: Boolean(await this.runner.findExecutable('dmesg')),
    };
    return this.capabilities;
  }

  private simulatedCapabilities(): Capabilities {
    const minimal = this.scenario === 'minimal-host';
    return {
      systemctl: !minimal,
      service: !minimal,
      nmcli: !minimal && this.scenario !== 'network-down',
      ip: true,
      rfkill: !minimal,
      network_sysfs: true,
      bluetooth_sysfs: !minimal,
      proc_telemetry: true,
      kernel_logs: !minimal,
    };
  }

  private start() { return Date.now(); }
  private result(started: number, strategy: string, fields: Omit<DiagnosticResult, 'execution'>): DiagnosticResult {
    return { ...fields, execution: { mode: this.simulation ? 'simulation' : 'host', strategy, elapsed_ms: Date.now() - started } };
  }
  private async caps() { return this.refreshCapabilities(); }
  private failure(started: number, strategy: string, capabilities: Capabilities, error: ErrorCode, summary: string): DiagnosticResult {
    return this.result(started, strategy, {
      status: error === 'permission_denied' ? 'unavailable' : 'error', summary, capabilities,
      observations: [{ code: error, severity: 'warning', message: summary }], remediation: remediationFor[error], error,
    });
  }

  async systemHealth(): Promise<DiagnosticResult> {
    const started = this.start(); const capabilities = await this.caps();
    try {
      if (this.simulation || capabilities.proc_telemetry) {
        const uptime = this.simulation ? '86400.00 43200.00' : await this.runner.readText('/proc/uptime');
        const load = this.simulation ? '0.12 0.08 0.05 1/120 42' : await this.runner.readText('/proc/loadavg');
        return this.result(started, '/proc telemetry', { status: 'healthy', summary: 'System telemetry is available.', capabilities,
          observations: [{ code: 'system_telemetry_available', severity: 'info', message: 'Read portable proc telemetry.', evidence: { uptime_seconds: Math.floor(Number(uptime.split(' ')[0])), load_1m: load.split(' ')[0] } }], remediation: [] });
      }
      const uptime = await this.runner.findExecutable('uptime');
      if (!uptime) return this.failure(started, 'none', capabilities, 'command_unavailable', 'No portable system telemetry source is available.');
      await this.runner.run(uptime, []);
      return this.result(started, 'uptime', { status: 'healthy', summary: 'System telemetry is available.', capabilities, observations: [{ code: 'system_telemetry_available', severity: 'info', message: 'Read uptime fallback telemetry.' }], remediation: [] });
    } catch (error) { return this.failure(started, '/proc telemetry', capabilities, normaliseError(error), 'System telemetry could not be read.'); }
  }

  async networkState(): Promise<DiagnosticResult> {
    const started = this.start(); const capabilities = await this.caps();
    if (this.simulation && this.scenario === 'network-down') return this.result(started, 'ip -j link', { status: 'degraded', summary: 'No active network interface was detected.', capabilities, observations: [{ code: 'network_unavailable', severity: 'critical', message: 'NetworkManager is unavailable and no active link was found.' }], remediation: ['Check Ethernet/Wi-Fi link state and network configuration before retrying.'] });
    try {
      if (capabilities.nmcli) {
        const nmcli = await this.runner.findExecutable('nmcli');
        const output = nmcli && !this.simulation ? (await this.runner.run(nmcli, ['-t', '-f', 'DEVICE,TYPE,STATE', 'device', 'status'])).stdout : 'eth0:ethernet:connected';
        const connected = output.split('\n').some((line) => /:connected$/i.test(line));
        return this.result(started, 'nmcli', { status: connected ? 'healthy' : 'degraded', summary: connected ? 'NetworkManager telemetry is available.' : 'No active network interface was detected.', capabilities, observations: [{ code: connected ? 'network_available' : 'network_unavailable', severity: connected ? 'info' : 'critical', message: connected ? 'Network interfaces were inspected through NetworkManager.' : 'NetworkManager found no connected interface.' }], remediation: connected ? [] : ['Check Ethernet/Wi-Fi link state and network configuration before retrying.'] });
      }
      if (capabilities.ip) {
        const ip = await this.runner.findExecutable('ip');
        const links = ip && !this.simulation ? JSON.parse((await this.runner.run(ip, ['-j', 'link'])).stdout || '[]') as Array<{ ifname?: string; operstate?: string }> : [{ ifname: 'eth0', operstate: 'UP' }];
        const connected = links.some((link) => link.ifname !== 'lo' && link.operstate === 'UP');
        return this.result(started, 'ip -j link', { status: connected ? 'healthy' : 'degraded', summary: connected ? 'Network link telemetry is available.' : 'No active network interface was detected.', capabilities, observations: [{ code: connected ? 'network_fallback_active' : 'network_unavailable', severity: connected ? 'info' : 'critical', message: connected ? 'Used portable ip link fallback.' : 'No active link was found through ip.' }], remediation: connected ? [] : ['Check Ethernet/Wi-Fi link state and network configuration before retrying.'] });
      }
      if (capabilities.network_sysfs) {
        const interfaces = this.simulation ? ['eth0'] : await this.runner.listDirectory('/sys/class/net');
        return this.result(started, '/sys/class/net', { status: interfaces.length ? 'healthy' : 'degraded', summary: interfaces.length ? 'Network interfaces are present.' : 'No network interface was detected.', capabilities, observations: [{ code: interfaces.length ? 'network_fallback_active' : 'network_unavailable', severity: interfaces.length ? 'info' : 'critical', message: interfaces.length ? 'Used sysfs network fallback.' : 'No network interface was found.' }], remediation: interfaces.length ? [] : ['Check Ethernet/Wi-Fi link state and network configuration before retrying.'] });
      }
      return this.failure(started, 'none', capabilities, 'command_unavailable', 'No supported network diagnostic capability is available.');
    } catch (error) { return this.failure(started, 'network diagnostic', capabilities, normaliseError(error), 'Network state could not be inspected.'); }
  }

  async bluetoothState(): Promise<DiagnosticResult> {
    const started = this.start(); const capabilities = await this.caps();
    const absent = this.simulation && this.scenario === 'minimal-host';
    if (absent || (!capabilities.rfkill && !capabilities.bluetooth_sysfs)) return this.result(started, 'none', { status: 'unavailable', summary: 'Bluetooth hardware is not present.', capabilities, observations: [{ code: 'hardware_not_present', severity: 'info', message: 'No Bluetooth adapter capability was detected.' }], remediation: remediationFor.hardware_not_present, error: 'hardware_not_present' });
    if (this.simulation && this.scenario === 'bluetooth-blocked') return this.result(started, 'rfkill', { status: 'degraded', summary: 'Bluetooth adapter is soft-blocked.', capabilities, observations: [{ code: 'bluetooth_soft_blocked', severity: 'warning', message: 'An adapter is present but software radio blocking is active.' }], remediation: ['Clear the Bluetooth soft block only if policy allows it, then rerun this read-only check.'] });
    try {
      if (capabilities.rfkill) {
        const rfkill = await this.runner.findExecutable('rfkill');
        const output = rfkill && !this.simulation ? (await this.runner.run(rfkill, ['list', 'bluetooth'])).stdout : '0: hci0: Bluetooth\n\tSoft blocked: no';
        if (!output) return this.result(started, 'rfkill', { status: 'unavailable', summary: 'Bluetooth hardware is not present.', capabilities, observations: [{ code: 'hardware_not_present', severity: 'info', message: 'rfkill found no Bluetooth adapter.' }], remediation: remediationFor.hardware_not_present, error: 'hardware_not_present' });
        const blocked = /soft blocked:\s*yes/i.test(output);
        return this.result(started, 'rfkill', { status: blocked ? 'degraded' : 'healthy', summary: blocked ? 'Bluetooth adapter is soft-blocked.' : 'Bluetooth adapter telemetry is available.', capabilities, observations: [{ code: blocked ? 'bluetooth_soft_blocked' : 'bluetooth_available', severity: blocked ? 'warning' : 'info', message: blocked ? 'Software radio blocking is active.' : 'Bluetooth state was inspected with rfkill.' }], remediation: blocked ? ['Clear the Bluetooth soft block only if policy allows it, then rerun this read-only check.'] : [] });
      }
      const adapters = this.simulation ? ['hci0'] : await this.runner.listDirectory('/sys/class/bluetooth');
      return this.result(started, 'Bluetooth sysfs', { status: adapters.length ? 'healthy' : 'unavailable', summary: adapters.length ? 'Bluetooth adapter is present.' : 'Bluetooth hardware is not present.', capabilities, observations: [{ code: adapters.length ? 'bluetooth_available' : 'hardware_not_present', severity: 'info', message: adapters.length ? 'Used Bluetooth sysfs fallback.' : 'No Bluetooth adapter was found.' }], remediation: adapters.length ? [] : remediationFor.hardware_not_present, ...(adapters.length ? {} : { error: 'hardware_not_present' as const }) });
    } catch (error) { return this.failure(started, 'bluetooth diagnostic', capabilities, normaliseError(error), 'Bluetooth state could not be inspected.'); }
  }

  async serviceState(serviceName: string, action: 'status' | 'restart'): Promise<DiagnosticResult> {
    const started = this.start(); const capabilities = await this.caps();
    if (!capabilities.systemctl && !capabilities.service) return this.result(started, 'none', { status: 'unavailable', summary: 'No supported service manager is available.', capabilities, observations: [{ code: 'service_manager_unavailable', severity: 'warning', message: 'Neither systemctl nor service is available.' }], remediation: remediationFor.service_manager_unavailable, error: 'service_manager_unavailable' });
    const strategy = capabilities.systemctl ? 'systemctl' : 'service';
    if (this.simulation) {
      const failed = this.scenario === 'service-failed';
      const restarted = action === 'restart';
      return this.result(started, strategy, { status: restarted || !failed ? 'healthy' : 'degraded', summary: restarted ? `Simulation: would restart ${serviceName}.` : failed ? `${serviceName} is failed.` : `${serviceName} is healthy.`, capabilities, observations: [{ code: restarted ? 'simulated_restart' : failed ? 'service_failed' : 'service_healthy', severity: failed && !restarted ? 'critical' : 'info', message: restarted ? 'No host service was restarted in simulation mode.' : failed ? 'The service requires an explicit restart decision.' : 'Read-only service preflight passed.' }], remediation: failed && !restarted ? [`Review ${serviceName} logs, then request an explicit allowlisted restart if appropriate.`] : [] });
    }
    try {
      const executable = await this.runner.findExecutable(strategy);
      if (!executable) return this.failure(started, strategy, capabilities, 'command_unavailable', 'The selected service manager is unavailable.');
      const preflightArgs = strategy === 'systemctl' ? ['status', serviceName, '--no-pager'] : [serviceName, 'status'];
      await this.runner.run(executable, preflightArgs);
      if (action === 'restart') await this.runner.run(executable, strategy === 'systemctl' ? ['restart', serviceName, '--no-pager'] : [serviceName, 'restart']);
      return this.result(started, strategy, { status: 'healthy', summary: action === 'restart' ? `${serviceName} restart completed.` : `${serviceName} is available.`, capabilities, observations: [{ code: action === 'restart' ? 'service_restarted' : 'service_healthy', severity: 'info', message: action === 'restart' ? 'An explicit allowlisted restart was completed after preflight.' : 'Read-only service preflight passed.' }], remediation: [] });
    } catch (error) {
      const code = normaliseError(error);
      if (action === 'status' && code === 'unexpected_execution_failure') {
        return this.result(started, strategy, {
          status: 'degraded', summary: `${serviceName} is not healthy.`, capabilities,
          observations: [{ code: 'service_failed', severity: 'critical', message: 'Read-only service preflight reported a failed or inactive service.' }],
          remediation: [`Review ${serviceName} logs, then request an explicit allowlisted restart if appropriate.`],
        });
      }
      return this.failure(started, strategy, capabilities, code, `Service ${action} could not be completed.`);
    }
  }

  async kernelLogs(): Promise<{ content: string; result: DiagnosticResult }> {
    const started = this.start(); const capabilities = await this.caps();
    if (!capabilities.kernel_logs) return { content: 'Kernel logs are unavailable on this host.', result: this.failure(started, 'none', capabilities, 'command_unavailable', 'Kernel log access is unavailable.') };
    if (this.simulation) return { content: 'simulation: kernel log access available', result: this.result(started, 'dmesg --lines 50', { status: 'healthy', summary: 'Kernel log access is available.', capabilities, observations: [{ code: 'kernel_logs_available', severity: 'info', message: 'Simulation kernel log fixture returned.' }], remediation: [] }) };
    try {
      const dmesg = await this.runner.findExecutable('dmesg');
      if (!dmesg) return { content: 'Kernel logs are unavailable on this host.', result: this.failure(started, 'none', capabilities, 'command_unavailable', 'Kernel log access is unavailable.') };
      const { stdout } = await this.runner.run(dmesg, ['--lines', '50']);
      return { content: stdout, result: this.result(started, 'dmesg --lines 50', { status: 'healthy', summary: 'Kernel log access is available.', capabilities, observations: [{ code: 'kernel_logs_available', severity: 'info', message: 'Read a fixed-size kernel log sample.' }], remediation: [] }) };
    } catch (error) { const code = normaliseError(error); return { content: 'Kernel logs are unavailable on this host.', result: this.failure(started, 'dmesg --lines 50', capabilities, code, 'Kernel log access could not be read.') }; }
  }
}
