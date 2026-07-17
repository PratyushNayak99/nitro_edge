var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Widget, z, Injectable } from '@nitrostack/core';
import { execFile } from 'child_process';
import { promisify } from 'util';
const execFileAsync = promisify(execFile);
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
LinuxDiagnostics = __decorate([
    Injectable()
], LinuxDiagnostics);
export { LinuxDiagnostics };
//# sourceMappingURL=diagnostics.tool.js.map