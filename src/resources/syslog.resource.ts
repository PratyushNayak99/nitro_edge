import { ResourceDecorator as Resource, ExecutionContext, Injectable } from '@nitrostack/core';
import { DiagnosticsPlatform } from '../diagnostics/diagnostics-platform.js';

@Injectable({ deps: [DiagnosticsPlatform] })
export class SystemLogs {
  constructor(private readonly diagnostics: DiagnosticsPlatform) {}

  @Resource({
    uri: 'syslog://dmesg',
    name: 'Kernel Logs (dmesg)',
    description: 'Returns a fixed-size kernel log sample, or a sanitized availability message.',
    mimeType: 'text/plain',
  })
  async getDmesg(ctx: ExecutionContext) {
    const { content, result } = await this.diagnostics.kernelLogs();
    ctx.logger.info('Kernel log resource requested', { status: result.status, strategy: result.execution.strategy });
    return content;
  }
}
