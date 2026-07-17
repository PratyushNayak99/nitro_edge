import { ResourceDecorator as Resource, ExecutionContext, Injectable } from '@nitrostack/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable() // <-- FIX: Add the DI decorator here too
export class SystemLogs {
  @Resource({
    uri: 'syslog://dmesg',
    name: 'Kernel Logs (dmesg)',
    description: 'Returns the last 50 lines of the kernel log (dmesg).',
    mimeType: 'text/plain',
  })
  async getDmesg(ctx: ExecutionContext) {
    try {
      const { stdout } = await execAsync('dmesg | tail -n 50');
      return stdout;
    } catch (e: any) {
      return `Error retrieving logs: ${e.message}`;
    }
  }
}
