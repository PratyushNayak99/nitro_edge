import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiagnosticsPlatform, type CommandRunner } from '../src/diagnostics/diagnostics-platform.js';
import { AuditResultSchema, DiagnosticResultSchema, LinuxDiagnostics } from '../src/tools/diagnostics.tool.js';

class FakeRunner implements CommandRunner {
  constructor(private readonly commands: string[] = [], private readonly files: Record<string, string> = {}) {}
  async findExecutable(name: string) { return this.commands.includes(name) ? `/safe/${name}` : undefined; }
  async run(file: string, args: readonly string[]) {
    if (file.includes('ip') && args.join(' ') === '-j link') return { stdout: '[{"ifname":"eth0","operstate":"UP"}]', stderr: '' };
    if (file.includes('systemctl') && args[0] === 'status') return { stdout: 'active', stderr: '' };
    return { stdout: '', stderr: '' };
  }
  async readText(path: string) { if (!(path in this.files)) throw Object.assign(new Error('missing'), { code: 'ENOENT' }); return this.files[path]; }
  async listDirectory(path: string) { return path === '/sys/class/net' ? ['eth0'] : path === '/sys/class/bluetooth' ? ['hci0'] : []; }
}

describe('DiagnosticsPlatform', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('uses proc telemetry before uptime and returns the normalized contract', async () => {
    const platform = new DiagnosticsPlatform(new FakeRunner([], { '/proc/uptime': '100.00 50.00', '/proc/loadavg': '0.01 0.02 0.03 1/1 1' }));
    const result = await platform.systemHealth();
    expect(result.status).toBe('healthy');
    expect(result.execution.strategy).toBe('/proc telemetry');
    expect(result.observations[0].evidence?.uptime_seconds).toBe(100);
  });

  it('falls back from NetworkManager to ip link', async () => {
    const platform = new DiagnosticsPlatform(new FakeRunner(['ip'], { '/proc/uptime': '1 1', '/proc/loadavg': '0 0 0 1/1 1' }));
    const result = await platform.networkState();
    expect(result.status).toBe('healthy');
    expect(result.execution.strategy).toBe('ip -j link');
  });

  it('does not expose raw command details in an unavailable service result', async () => {
    const platform = new DiagnosticsPlatform(new FakeRunner([], { '/proc/uptime': '1 1', '/proc/loadavg': '0 0 0 1/1 1' }));
    const result = await platform.serviceState('docker', 'status');
    expect(result.error).toBe('service_manager_unavailable');
    expect(JSON.stringify(result)).not.toContain('/safe');
    expect(result.remediation[0]).toContain('systemctl');
  });

  it.each([
    ['nominal', 'healthy'],
    ['network-down', 'degraded'],
    ['bluetooth-blocked', 'degraded'],
    ['service-failed', 'degraded'],
    ['minimal-host', 'unavailable'],
  ] as const)('supports deterministic %s simulator scenario', async (scenario, expected) => {
    vi.stubEnv('EDGE_SENTINEL_MODE', 'simulation');
    vi.stubEnv('EDGE_SENTINEL_SCENARIO', scenario);
    const platform = new DiagnosticsPlatform();
    const result = scenario === 'network-down' ? await platform.networkState()
      : scenario === 'bluetooth-blocked' || scenario === 'minimal-host' ? await platform.bluetoothState()
        : scenario === 'service-failed' ? await platform.serviceState('docker', 'status')
          : await platform.systemHealth();
    expect(result.status).toBe(expected);
    expect(result.execution.mode).toBe('simulation');
  });

  it('returns a simulated explicit restart without executing a host command', async () => {
    vi.stubEnv('EDGE_SENTINEL_MODE', 'simulation');
    vi.stubEnv('EDGE_SENTINEL_SCENARIO', 'service-failed');
    const result = await new DiagnosticsPlatform().serviceState('docker', 'restart');
    expect(result.observations[0].code).toBe('simulated_restart');
    expect(result.summary).toContain('would restart');
  });

  it('validates every public diagnostic tool response against its widget-facing contract', async () => {
    const platform = new DiagnosticsPlatform(new FakeRunner(['systemctl', 'ip'], { '/proc/uptime': '1 1', '/proc/loadavg': '0 0 0 1/1 1' }));
    const tools = new LinuxDiagnostics(platform);
    const context = { logger: { debug() {}, info() {}, warn() {}, error() {} }, requestId: 'test' };
    expect(DiagnosticResultSchema.safeParse(await tools.getSystemHealth()).success).toBe(true);
    expect(DiagnosticResultSchema.safeParse(await tools.checkHardwareState({ target: 'network' })).success).toBe(true);
    expect(DiagnosticResultSchema.safeParse(await tools.manageSystemService({ service_name: 'docker', action: 'status' })).success).toBe(true);
    expect(AuditResultSchema.safeParse(await tools.auditEdgeSystem({ intensity: 'standard' }, context)).success).toBe(true);
  });
});
