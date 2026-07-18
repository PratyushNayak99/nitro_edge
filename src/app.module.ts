import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { LinuxDiagnostics } from './tools/diagnostics.tool.js';
import { SystemLogs } from './resources/syslog.resource.js';
import { DiagnosticsPlatform } from './diagnostics/diagnostics-platform.js';

@McpApp({
  module: AppModule,
  server: {
    name: 'edge-sentinel',
    version: '1.0.0',
  },
  auth: { required: false },
  logging: {
    level: 'info',
  },
} as Parameters<typeof McpApp>[0] & { auth: { required: false } })
@Module({
  name: 'edge-sentinel',
  description: 'Capability-aware, portable Linux edge diagnostics service',
  imports: [ConfigModule.forRoot()],
  controllers: [LinuxDiagnostics, SystemLogs],
  providers: [
    DiagnosticsPlatform,
    LinuxDiagnostics,
    SystemLogs,
    { provide: 'OAUTH_CONFIG', useValue: { required: false, resourceUri: 'http://localhost', authorizationServers: ['http://localhost'] } },
  ],
})
export class AppModule {}
