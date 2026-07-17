import { ToolDecorator as Tool, Widget, z, Injectable } from '@nitrostack/core';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const ALLOWED_SERVICES = ['bluetooth', 'NetworkManager', 'docker', 'sshd'] as const;
const ALLOWED_TARGETS = ['bluetooth', 'network'] as const;

const ManageSystemServiceSchema = z.object({
  service_name: z.enum(ALLOWED_SERVICES).describe('Approved systemd service to inspect or restart'),
  action: z.enum(['restart', 'status']).describe('Allowed systemd action'),
});

const CheckHardwareStateSchema = z.object({
  target: z.enum(ALLOWED_TARGETS).describe('Approved hardware subsystem to inspect'),
});

@Injectable()
export class LinuxDiagnostics {
  @Tool({
    name: 'manage_system_service',
    description: 'Safely inspect or restart an approved systemd service on the edge device.',
    inputSchema: ManageSystemServiceSchema,
  })
  @Widget('hardware-hud')
  async manageSystemService(input: z.infer<typeof ManageSystemServiceSchema>) {
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
    } catch (error) {
      return {
        subsystem: 'System Service',
        target: input.service_name,
        output: error instanceof Error ? error.message : String(error),
        success: false,
      };
    }
  }

  @Tool({
    name: 'check_hardware_state',
    description: 'Safely inspect the Bluetooth or network hardware state of the edge device.',
    inputSchema: CheckHardwareStateSchema,
  })
  @Widget('hardware-hud')
  async checkHardwareState(input: z.infer<typeof CheckHardwareStateSchema>) {
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
    } catch (error) {
      return {
        subsystem: 'Hardware State',
        target: input.target,
        output: error instanceof Error ? error.message : String(error),
        success: false,
      };
    }
  }
}
