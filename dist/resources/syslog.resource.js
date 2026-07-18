var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ResourceDecorator as Resource, Injectable } from '@nitrostack/core';
import { DiagnosticsPlatform } from '../diagnostics/diagnostics-platform.js';
let SystemLogs = class SystemLogs {
    diagnostics;
    constructor(diagnostics) {
        this.diagnostics = diagnostics;
    }
    async getDmesg(ctx) {
        const { content, result } = await this.diagnostics.kernelLogs();
        ctx.logger.info('Kernel log resource requested', { status: result.status, strategy: result.execution.strategy });
        return content;
    }
};
__decorate([
    Resource({
        uri: 'syslog://dmesg',
        name: 'Kernel Logs (dmesg)',
        description: 'Returns a fixed-size kernel log sample, or a sanitized availability message.',
        mimeType: 'text/plain',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemLogs.prototype, "getDmesg", null);
SystemLogs = __decorate([
    Injectable({ deps: [DiagnosticsPlatform] }),
    __metadata("design:paramtypes", [DiagnosticsPlatform])
], SystemLogs);
export { SystemLogs };
//# sourceMappingURL=syslog.resource.js.map