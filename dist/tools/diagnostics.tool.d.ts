import { z, ExecutionContext } from '@nitrostack/core';
declare const ManageSystemServiceSchema: z.ZodObject<{
    service_name: z.ZodEnum<["bluetooth", "NetworkManager", "docker", "sshd"]>;
    action: z.ZodEnum<["restart", "status"]>;
}, "strip", z.ZodTypeAny, {
    service_name: "bluetooth" | "NetworkManager" | "docker" | "sshd";
    action: "restart" | "status";
}, {
    service_name: "bluetooth" | "NetworkManager" | "docker" | "sshd";
    action: "restart" | "status";
}>;
declare const CheckHardwareStateSchema: z.ZodObject<{
    target: z.ZodEnum<["bluetooth", "network"]>;
}, "strip", z.ZodTypeAny, {
    target: "bluetooth" | "network";
}, {
    target: "bluetooth" | "network";
}>;
export declare class LinuxDiagnostics {
    manageSystemService(input: z.infer<typeof ManageSystemServiceSchema>): Promise<{
        subsystem: string;
        target: "bluetooth" | "NetworkManager" | "docker" | "sshd";
        output: string;
        success: boolean;
    }>;
    checkHardwareState(input: z.infer<typeof CheckHardwareStateSchema>): Promise<{
        subsystem: string;
        target: "bluetooth" | "network";
        output: string;
        success: boolean;
    }>;
    getSystemHealth(): Promise<{
        subsystem: string;
        target: string;
        output: string;
        success: boolean;
    }>;
    auditEdgeSystem(args: {
        intensity: 'standard' | 'deep';
    }, ctx: ExecutionContext): Promise<{
        audit_id: number;
        status: string;
        scan_depth: "standard" | "deep";
        findings: {
            systemd: string;
            hardware: string;
        };
        timestamp: string;
    }>;
    incidentTriage(args: {
        subsystem: string;
    }, ctx: ExecutionContext): Promise<{
        role: "user";
        content: string;
    }[]>;
}
export {};
//# sourceMappingURL=diagnostics.tool.d.ts.map