import { ToolDecorator as Tool, Widget, z, Injectable, ExecutionContext, PromptDecorator as Prompt } from '@nitrostack/core';
import { DiagnosticsPlatform } from '../diagnostics/diagnostics-platform.js';

const ALLOWED_SERVICES = ['bluetooth', 'NetworkManager', 'docker', 'sshd'] as const;
const ALLOWED_TARGETS = ['bluetooth', 'network'] as const;

const ManageSystemServiceSchema = z.object({
  service_name: z.enum(ALLOWED_SERVICES).describe('Approved systemd service to inspect or restart'),
  action: z.enum(['restart', 'status']).describe('Allowed systemd action'),
});

const CheckHardwareStateSchema = z.object({
  target: z.enum(ALLOWED_TARGETS).describe('Approved hardware subsystem to inspect'),
});

const ObservationSchema = z.object({
  code: z.string(),
  severity: z.enum(['info', 'warning', 'critical']),
  message: z.string(),
  evidence: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const DiagnosticResultSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unavailable', 'error']),
  summary: z.string(),
  capabilities: z.record(z.boolean()),
  observations: z.array(ObservationSchema),
  remediation: z.array(z.string()),
  execution: z.object({
    mode: z.enum(['host', 'simulation']),
    strategy: z.string(),
    elapsed_ms: z.number().nonnegative(),
  }),
  error: z.enum([
    'command_unavailable',
    'hardware_not_present',
    'service_manager_unavailable',
    'permission_denied',
    'command_timed_out',
    'unexpected_execution_failure',
  ]).optional(),
});

const AuditSchema = z.object({
  intensity: z.enum(['standard', 'deep']).default('standard').describe('The depth of the diagnostic scan.'),
});

export const AuditResultSchema = DiagnosticResultSchema.extend({
  audit_id: z.number(),
  scan_depth: z.enum(['standard', 'deep']),
  timestamp: z.string(),
  checks: z.object({
    system_health: DiagnosticResultSchema,
    network: DiagnosticResultSchema,
    bluetooth: DiagnosticResultSchema,
    services: z.array(DiagnosticResultSchema),
  }),
});

@Injectable({ deps: [DiagnosticsPlatform] })
export class LinuxDiagnostics {
  constructor(private readonly diagnostics: DiagnosticsPlatform) {}

  @Tool({
    name: 'manage_system_service',
    description: 'Safely inspect or explicitly restart an approved service after a read-only preflight.',
    inputSchema: ManageSystemServiceSchema,
    outputSchema: DiagnosticResultSchema,
  })
  @Widget('hardware-hud')
  async manageSystemService(input: z.infer<typeof ManageSystemServiceSchema>) {
    return this.diagnostics.serviceState(input.service_name, input.action);
  }

  @Tool({
    name: 'check_hardware_state',
    description: 'Safely inspect Bluetooth or network state using portable capability-aware fallbacks.',
    inputSchema: CheckHardwareStateSchema,
    outputSchema: DiagnosticResultSchema,
  })
  @Widget('hardware-hud')
  async checkHardwareState(input: z.infer<typeof CheckHardwareStateSchema>) {
    return input.target === 'bluetooth'
      ? this.diagnostics.bluetoothState()
      : this.diagnostics.networkState();
  }

  @Tool({
    name: 'get_system_health',
    description: 'Safely retrieves portable edge-node telemetry using proc and uptime fallbacks.',
    inputSchema: z.object({}),
    outputSchema: DiagnosticResultSchema,
  })
  @Widget('hardware-hud')
  async getSystemHealth() {
    return this.diagnostics.systemHealth();
  }

  @Tool({
    name: 'audit_edge_system',
    description: 'Run a capability-aware, read-only aggregate edge diagnostic. Task progress is optional.',
    inputSchema: AuditSchema,
    outputSchema: AuditResultSchema,
    taskSupport: 'optional',
  })
  @Widget('hardware-hud')
  async auditEdgeSystem(args: z.infer<typeof AuditSchema>, ctx: ExecutionContext) {
    const started = Date.now();
    ctx.logger.info('Starting portable edge system audit', { intensity: args.intensity });
    ctx.task?.updateProgress('Refreshing host capabilities...');
    ctx.task?.throwIfCancelled();
    const systemHealth = await this.diagnostics.systemHealth();
    ctx.task?.updateProgress('Inspecting network state...');
    ctx.task?.throwIfCancelled();
    const network = await this.diagnostics.networkState();
    ctx.task?.updateProgress('Inspecting Bluetooth state...');
    ctx.task?.throwIfCancelled();
    const bluetooth = await this.diagnostics.bluetoothState();
    ctx.task?.updateProgress('Inspecting allowlisted service health...');
    const services = await Promise.all(ALLOWED_SERVICES.map((service) => this.diagnostics.serviceState(service, 'status')));
    ctx.task?.throwIfCancelled();

    const allChecks = [systemHealth, network, bluetooth, ...services];
    const status = allChecks.some((check) => check.status === 'error') ? 'error'
      : allChecks.some((check) => check.status === 'degraded') ? 'degraded'
        : allChecks.some((check) => check.status === 'unavailable') ? 'unavailable' : 'healthy';
    const remediation = [...new Set(allChecks.flatMap((check) => check.remediation))];
    const capabilities = await this.diagnostics.refreshCapabilities();
    ctx.task?.updateProgress('Aggregate diagnostic complete.');

    return {
      audit_id: Date.now(),
      scan_depth: args.intensity,
      timestamp: new Date().toISOString(),
      status,
      summary: `Edge audit completed with ${status} status.`,
      capabilities,
      observations: allChecks.flatMap((check) => check.observations),
      remediation,
      execution: { mode: systemHealth.execution.mode, strategy: 'aggregate capability-aware audit', elapsed_ms: Date.now() - started },
      checks: { system_health: systemHealth, network, bluetooth, services },
    };
  }

  @Prompt({
    name: 'incident_triage',
    description: 'Run a capability-aware SRE diagnostic sweep on a failing subsystem.',
    arguments: [{ name: 'subsystem', description: 'The subsystem failing', required: true }],
  })
  async incidentTriage(args: { subsystem: string }, ctx: ExecutionContext) {
    ctx.logger.info('Generating capability-aware incident triage runbook', { subsystem: args.subsystem });
    return [{
      role: 'user' as const,
      content: `Act as EdgeSentinel, an autonomous bare-metal Linux SRE Copilot. Investigate ${args.subsystem}. Start with get_system_health, then use check_hardware_state only for capabilities relevant to the subsystem, and fetch syslog://dmesg when kernel logs are available. Interpret normalized status, capabilities, observations, remediation, execution, and error fields; never infer host details from absent raw output. If an allowlisted service is degraded or failed, recommend an explicit manage_system_service restart only after reviewing its read-only status. Do not perform a restart automatically. Synthesize a root-cause explanation and safe next action.`,
    }];
  }
}
