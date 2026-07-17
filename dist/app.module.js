var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { LinuxDiagnostics } from './tools/diagnostics.tool.js';
import { SystemLogs } from './resources/syslog.resource.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    McpApp({
        module: AppModule,
        server: {
            name: 'edge-sentinel',
            version: '1.0.0',
        },
        auth: { required: false },
        logging: {
            level: 'info',
        },
    }),
    Module({
        name: 'edge-sentinel',
        description: 'Secure bare-metal AI incident-response copilot for Fedora Linux edge devices',
        imports: [ConfigModule.forRoot()],
        controllers: [LinuxDiagnostics, SystemLogs],
        providers: [
            LinuxDiagnostics,
            SystemLogs,
            { provide: 'OAUTH_CONFIG', useValue: { required: false, resourceUri: 'http://localhost', authorizationServers: ['http://localhost'] } },
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map