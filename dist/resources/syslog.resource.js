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
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
let SystemLogs = class SystemLogs {
    async getDmesg(ctx) {
        try {
            const { stdout } = await execAsync('dmesg | tail -n 50');
            return stdout;
        }
        catch (e) {
            return `Error retrieving logs: ${e.message}`;
        }
    }
};
__decorate([
    Resource({
        uri: 'syslog://dmesg',
        name: 'Kernel Logs (dmesg)',
        description: 'Returns the last 50 lines of the kernel log (dmesg).',
        mimeType: 'text/plain',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemLogs.prototype, "getDmesg", null);
SystemLogs = __decorate([
    Injectable() // <-- FIX: Add the DI decorator here too
], SystemLogs);
export { SystemLogs };
//# sourceMappingURL=syslog.resource.js.map