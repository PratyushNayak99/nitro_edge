import { ExecutionContext } from '@nitrostack/core';
import { DiagnosticsPlatform } from '../diagnostics/diagnostics-platform.js';
export declare class SystemLogs {
    private readonly diagnostics;
    constructor(diagnostics: DiagnosticsPlatform);
    getDmesg(ctx: ExecutionContext): Promise<string>;
}
//# sourceMappingURL=syslog.resource.d.ts.map