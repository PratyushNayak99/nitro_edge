import { z } from '@nitrostack/core';
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
}
export {};
//# sourceMappingURL=diagnostics.tool.d.ts.map