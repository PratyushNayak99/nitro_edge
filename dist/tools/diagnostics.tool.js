var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Widget, z, Injectable, PromptDecorator as Prompt } from '@nitrostack/core';
import { execFile } from 'child_process';
import { promisify } from 'util';
const execFileAsync = promisify(execFile);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ALLOWED_SERVICES = ['bluetooth', 'NetworkManager', 'docker', 'sshd'];
const ALLOWED_TARGETS = ['bluetooth', 'network'];
const ManageSystemServiceSchema = z.object({
    service_name: z.enum(ALLOWED_SERVICES).describe('Approved systemd service to inspect or restart'),
    action: z.enum(['restart', 'status']).describe('Allowed systemd action'),
});
const CheckHardwareStateSchema = z.object({
    target: z.enum(ALLOWED_TARGETS).describe('Approved hardware subsystem to inspect'),
});
let LinuxDiagnostics = class LinuxDiagnostics {
    async manageSystemService(input) {
        try {
            const { stdout } = await execFileAsync('/usr/bin/systemctl', [
                input.action,
                input.service_name,
                '--no-pager',
            ]);
            return {
                subsystem: 'System Service',
                target: input.service_name,
                output: stdout,
                success: true,
            };
        }
        catch (error) {
            return {
                subsystem: 'System Service',
                target: input.service_name,
                output: error instanceof Error ? error.message : String(error),
                success: false,
            };
        }
    }
    async checkHardwareState(input) {
        try {
            const command = input.target === 'bluetooth'
                ? { file: '/usr/sbin/rfkill', args: ['list', 'bluetooth'] }
                : { file: '/usr/bin/nmcli', args: ['device', 'status'] };
            const { stdout } = await execFileAsync(command.file, command.args);
            return {
                subsystem: 'Hardware State',
                target: input.target,
                output: stdout,
                success: true,
            };
        }
        catch (error) {
            return {
                subsystem: 'Hardware State',
                target: input.target,
                output: error instanceof Error ? error.message : String(error),
                success: false,
            };
        }
    }
    async getSystemHealth() {
        try {
            const { stdout } = await execFileAsync('/usr/bin/uptime');
            return {
                subsystem: 'Global Telemetry',
                target: 'Edge Node Load',
                output: stdout.trim(),
                success: true,
            };
        }
        catch (error) {
            return {
                subsystem: 'Global Telemetry',
                target: 'Edge Node Load',
                output: error instanceof Error ? error.message : String(error),
                success: false,
            };
        }
    }
    async auditEdgeSystem(args, ctx) {
        ctx.logger.info('Starting edge system audit', { intensity: args.intensity });
        ctx.task?.updateProgress('🔍 Initializing secure telemetry link to edge kernel...');
        await sleep(1500);
        ctx.task?.throwIfCancelled();
        ctx.task?.updateProgress('🛡️ Scanning systemd daemon statuses...');
        let systemd;
        try {
            const { stdout } = await execFileAsync('/usr/bin/systemctl', [
                'list-units',
                '--state=failed',
                '--no-pager',
            ]);
            systemd = stdout.trim();
        }
        catch (error) {
            systemd = error instanceof Error ? error.message : String(error);
        }
        await sleep(2000);
        ctx.task?.throwIfCancelled();
        ctx.task?.updateProgress('📡 Analyzing hardware interfaces...');
        let hardware;
        try {
            const { stdout } = await execFileAsync('/usr/sbin/rfkill', ['list']);
            hardware = stdout.trim();
        }
        catch (error) {
            hardware = error instanceof Error ? error.message : String(error);
        }
        await sleep(1500);
        ctx.task?.throwIfCancelled();
        ctx.task?.updateProgress('🧠 Synthesizing telemetry...');
        await sleep(1000);
        ctx.task?.throwIfCancelled();
        return {
            audit_id: Date.now(),
            status: 'COMPLETED',
            scan_depth: args.intensity,
            findings: {
                systemd,
                hardware,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async incidentTriage(args, ctx) {
        ctx.logger.info('Generating incident triage runbook', { subsystem: args.subsystem });
        return [
            {
                role: 'user',
                content: `Act as EdgeSentinel, an autonomous bare-metal Linux SRE Copilot. Investigate the failing ${args.subsystem} subsystem by executing this 4-step runbook: 1. Call get_system_health. 2. Call check_hardware_state. 3. Fetch syslog://dmesg. 4. If the subsystem is hung, call manage_system_service. Then synthesize all telemetry into a concise root-cause explanation with recommended remediation.`,
            },
        ];
    }
};
__decorate([
    Tool({
        name: 'manage_system_service',
        description: 'Safely inspect or restart an approved systemd service on the edge device.',
        inputSchema: ManageSystemServiceSchema,
    }),
    Widget('hardware-hud'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], LinuxDiagnostics.prototype, "manageSystemService", null);
__decorate([
    Tool({
        name: 'check_hardware_state',
        description: 'Safely inspect the Bluetooth or network hardware state of the edge device.',
        inputSchema: CheckHardwareStateSchema,
    }),
    Widget('hardware-hud'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], LinuxDiagnostics.prototype, "checkHardwareState", null);
__decorate([
    Tool({
        name: 'get_system_health',
        description: 'Safely retrieves overall edge node telemetry (uptime, load average).',
        inputSchema: z.object({}),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LinuxDiagnostics.prototype, "getSystemHealth", null);
__decorate([
    Tool({
        name: 'audit_edge_system',
        description: 'Run a secure, task-enabled audit of edge system services and hardware interfaces.',
        inputSchema: z.object({
            intensity: z.enum(['standard', 'deep']).default('standard').describe('The depth of the diagnostic scan.'),
        }),
        taskSupport: 'required',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinuxDiagnostics.prototype, "auditEdgeSystem", null);
__decorate([
    Prompt({
        name: 'incident_triage',
        description: 'Run a full automated SRE diagnostic sweep on a failing subsystem.',
        arguments: [
            {
                name: 'subsystem',
                description: 'The subsystem failing',
                required: true,
            },
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LinuxDiagnostics.prototype, "incidentTriage", null);
LinuxDiagnostics = __decorate([
    Injectable()
], LinuxDiagnostics);
export { LinuxDiagnostics };
//# sourceMappingURL=diagnostics.tool.js.map