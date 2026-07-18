export type DiagnosticStatus = 'healthy' | 'degraded' | 'unavailable' | 'error';
export type ErrorCode = 'command_unavailable' | 'hardware_not_present' | 'service_manager_unavailable' | 'permission_denied' | 'command_timed_out' | 'unexpected_execution_failure';
export interface Observation {
    code: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    evidence?: Record<string, string | number | boolean>;
}
export interface DiagnosticResult {
    status: DiagnosticStatus;
    summary: string;
    capabilities: Record<string, boolean>;
    observations: Observation[];
    remediation: string[];
    execution: {
        mode: 'host' | 'simulation';
        strategy: string;
        elapsed_ms: number;
    };
    error?: ErrorCode;
}
export interface CommandRunner {
    findExecutable(name: string): Promise<string | undefined>;
    run(file: string, args: readonly string[]): Promise<{
        stdout: string;
        stderr: string;
    }>;
    readText(path: string): Promise<string>;
    listDirectory(path: string): Promise<string[]>;
}
export interface Capabilities extends Record<string, boolean> {
    systemctl: boolean;
    service: boolean;
    nmcli: boolean;
    ip: boolean;
    rfkill: boolean;
    network_sysfs: boolean;
    bluetooth_sysfs: boolean;
    proc_telemetry: boolean;
    kernel_logs: boolean;
}
export declare class DiagnosticsPlatform {
    private readonly runner;
    private capabilities;
    private readonly simulation;
    private readonly scenario;
    constructor(runner?: CommandRunner);
    onModuleInit(): Promise<void>;
    refreshCapabilities(): Promise<Capabilities>;
    private simulatedCapabilities;
    private start;
    private result;
    private caps;
    private failure;
    systemHealth(): Promise<DiagnosticResult>;
    networkState(): Promise<DiagnosticResult>;
    bluetoothState(): Promise<DiagnosticResult>;
    serviceState(serviceName: string, action: 'status' | 'restart'): Promise<DiagnosticResult>;
    kernelLogs(): Promise<{
        content: string;
        result: DiagnosticResult;
    }>;
}
//# sourceMappingURL=diagnostics-platform.d.ts.map