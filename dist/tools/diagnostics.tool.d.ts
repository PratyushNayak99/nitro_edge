import { z, ExecutionContext } from '@nitrostack/core';
import { DiagnosticsPlatform } from '../diagnostics/diagnostics-platform.js';
declare const ManageSystemServiceSchema: z.ZodObject<{
    service_name: z.ZodEnum<["bluetooth", "NetworkManager", "docker", "sshd"]>;
    action: z.ZodEnum<["restart", "status"]>;
}, "strip", z.ZodTypeAny, {
    service_name: "bluetooth" | "NetworkManager" | "docker" | "sshd";
    action: "status" | "restart";
}, {
    service_name: "bluetooth" | "NetworkManager" | "docker" | "sshd";
    action: "status" | "restart";
}>;
declare const CheckHardwareStateSchema: z.ZodObject<{
    target: z.ZodEnum<["bluetooth", "network"]>;
}, "strip", z.ZodTypeAny, {
    target: "bluetooth" | "network";
}, {
    target: "bluetooth" | "network";
}>;
export declare const DiagnosticResultSchema: z.ZodObject<{
    status: z.ZodEnum<["healthy", "degraded", "unavailable", "error"]>;
    summary: z.ZodString;
    capabilities: z.ZodRecord<z.ZodString, z.ZodBoolean>;
    observations: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "critical"]>;
        message: z.ZodString;
        evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }>, "many">;
    remediation: z.ZodArray<z.ZodString, "many">;
    execution: z.ZodObject<{
        mode: z.ZodEnum<["host", "simulation"]>;
        strategy: z.ZodString;
        elapsed_ms: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    }, {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    }>;
    error: z.ZodOptional<z.ZodEnum<["command_unavailable", "hardware_not_present", "service_manager_unavailable", "permission_denied", "command_timed_out", "unexpected_execution_failure"]>>;
}, "strip", z.ZodTypeAny, {
    execution: {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    };
    status: "healthy" | "degraded" | "unavailable" | "error";
    summary: string;
    capabilities: Record<string, boolean>;
    observations: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }[];
    remediation: string[];
    error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
}, {
    execution: {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    };
    status: "healthy" | "degraded" | "unavailable" | "error";
    summary: string;
    capabilities: Record<string, boolean>;
    observations: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }[];
    remediation: string[];
    error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
}>;
declare const AuditSchema: z.ZodObject<{
    intensity: z.ZodDefault<z.ZodEnum<["standard", "deep"]>>;
}, "strip", z.ZodTypeAny, {
    intensity: "standard" | "deep";
}, {
    intensity?: "standard" | "deep" | undefined;
}>;
export declare const AuditResultSchema: z.ZodObject<{
    status: z.ZodEnum<["healthy", "degraded", "unavailable", "error"]>;
    summary: z.ZodString;
    capabilities: z.ZodRecord<z.ZodString, z.ZodBoolean>;
    observations: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "critical"]>;
        message: z.ZodString;
        evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }>, "many">;
    remediation: z.ZodArray<z.ZodString, "many">;
    execution: z.ZodObject<{
        mode: z.ZodEnum<["host", "simulation"]>;
        strategy: z.ZodString;
        elapsed_ms: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    }, {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    }>;
    error: z.ZodOptional<z.ZodEnum<["command_unavailable", "hardware_not_present", "service_manager_unavailable", "permission_denied", "command_timed_out", "unexpected_execution_failure"]>>;
} & {
    audit_id: z.ZodNumber;
    scan_depth: z.ZodEnum<["standard", "deep"]>;
    timestamp: z.ZodString;
    checks: z.ZodObject<{
        system_health: z.ZodObject<{
            status: z.ZodEnum<["healthy", "degraded", "unavailable", "error"]>;
            summary: z.ZodString;
            capabilities: z.ZodRecord<z.ZodString, z.ZodBoolean>;
            observations: z.ZodArray<z.ZodObject<{
                code: z.ZodString;
                severity: z.ZodEnum<["info", "warning", "critical"]>;
                message: z.ZodString;
                evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
            }, "strip", z.ZodTypeAny, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }>, "many">;
            remediation: z.ZodArray<z.ZodString, "many">;
            execution: z.ZodObject<{
                mode: z.ZodEnum<["host", "simulation"]>;
                strategy: z.ZodString;
                elapsed_ms: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }>;
            error: z.ZodOptional<z.ZodEnum<["command_unavailable", "hardware_not_present", "service_manager_unavailable", "permission_denied", "command_timed_out", "unexpected_execution_failure"]>>;
        }, "strip", z.ZodTypeAny, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }>;
        network: z.ZodObject<{
            status: z.ZodEnum<["healthy", "degraded", "unavailable", "error"]>;
            summary: z.ZodString;
            capabilities: z.ZodRecord<z.ZodString, z.ZodBoolean>;
            observations: z.ZodArray<z.ZodObject<{
                code: z.ZodString;
                severity: z.ZodEnum<["info", "warning", "critical"]>;
                message: z.ZodString;
                evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
            }, "strip", z.ZodTypeAny, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }>, "many">;
            remediation: z.ZodArray<z.ZodString, "many">;
            execution: z.ZodObject<{
                mode: z.ZodEnum<["host", "simulation"]>;
                strategy: z.ZodString;
                elapsed_ms: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }>;
            error: z.ZodOptional<z.ZodEnum<["command_unavailable", "hardware_not_present", "service_manager_unavailable", "permission_denied", "command_timed_out", "unexpected_execution_failure"]>>;
        }, "strip", z.ZodTypeAny, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }>;
        bluetooth: z.ZodObject<{
            status: z.ZodEnum<["healthy", "degraded", "unavailable", "error"]>;
            summary: z.ZodString;
            capabilities: z.ZodRecord<z.ZodString, z.ZodBoolean>;
            observations: z.ZodArray<z.ZodObject<{
                code: z.ZodString;
                severity: z.ZodEnum<["info", "warning", "critical"]>;
                message: z.ZodString;
                evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
            }, "strip", z.ZodTypeAny, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }>, "many">;
            remediation: z.ZodArray<z.ZodString, "many">;
            execution: z.ZodObject<{
                mode: z.ZodEnum<["host", "simulation"]>;
                strategy: z.ZodString;
                elapsed_ms: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }>;
            error: z.ZodOptional<z.ZodEnum<["command_unavailable", "hardware_not_present", "service_manager_unavailable", "permission_denied", "command_timed_out", "unexpected_execution_failure"]>>;
        }, "strip", z.ZodTypeAny, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }>;
        services: z.ZodArray<z.ZodObject<{
            status: z.ZodEnum<["healthy", "degraded", "unavailable", "error"]>;
            summary: z.ZodString;
            capabilities: z.ZodRecord<z.ZodString, z.ZodBoolean>;
            observations: z.ZodArray<z.ZodObject<{
                code: z.ZodString;
                severity: z.ZodEnum<["info", "warning", "critical"]>;
                message: z.ZodString;
                evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
            }, "strip", z.ZodTypeAny, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }>, "many">;
            remediation: z.ZodArray<z.ZodString, "many">;
            execution: z.ZodObject<{
                mode: z.ZodEnum<["host", "simulation"]>;
                strategy: z.ZodString;
                elapsed_ms: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }, {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            }>;
            error: z.ZodOptional<z.ZodEnum<["command_unavailable", "hardware_not_present", "service_manager_unavailable", "permission_denied", "command_timed_out", "unexpected_execution_failure"]>>;
        }, "strip", z.ZodTypeAny, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }, {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        bluetooth: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        network: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        system_health: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        services: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }[];
    }, {
        bluetooth: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        network: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        system_health: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        services: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    execution: {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    };
    status: "healthy" | "degraded" | "unavailable" | "error";
    summary: string;
    capabilities: Record<string, boolean>;
    observations: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }[];
    remediation: string[];
    audit_id: number;
    scan_depth: "standard" | "deep";
    timestamp: string;
    checks: {
        bluetooth: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        network: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        system_health: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        services: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }[];
    };
    error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
}, {
    execution: {
        mode: "host" | "simulation";
        strategy: string;
        elapsed_ms: number;
    };
    status: "healthy" | "degraded" | "unavailable" | "error";
    summary: string;
    capabilities: Record<string, boolean>;
    observations: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        evidence?: Record<string, string | number | boolean> | undefined;
    }[];
    remediation: string[];
    audit_id: number;
    scan_depth: "standard" | "deep";
    timestamp: string;
    checks: {
        bluetooth: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        network: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        system_health: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        };
        services: {
            execution: {
                mode: "host" | "simulation";
                strategy: string;
                elapsed_ms: number;
            };
            status: "healthy" | "degraded" | "unavailable" | "error";
            summary: string;
            capabilities: Record<string, boolean>;
            observations: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                evidence?: Record<string, string | number | boolean> | undefined;
            }[];
            remediation: string[];
            error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
        }[];
    };
    error?: "command_unavailable" | "hardware_not_present" | "service_manager_unavailable" | "permission_denied" | "command_timed_out" | "unexpected_execution_failure" | undefined;
}>;
export declare class LinuxDiagnostics {
    private readonly diagnostics;
    constructor(diagnostics: DiagnosticsPlatform);
    manageSystemService(input: z.infer<typeof ManageSystemServiceSchema>): Promise<import("../diagnostics/diagnostics-platform.js").DiagnosticResult>;
    checkHardwareState(input: z.infer<typeof CheckHardwareStateSchema>): Promise<import("../diagnostics/diagnostics-platform.js").DiagnosticResult>;
    getSystemHealth(): Promise<import("../diagnostics/diagnostics-platform.js").DiagnosticResult>;
    auditEdgeSystem(args: z.infer<typeof AuditSchema>, ctx: ExecutionContext): Promise<{
        audit_id: number;
        scan_depth: "standard" | "deep";
        timestamp: string;
        status: string;
        summary: string;
        capabilities: import("../diagnostics/diagnostics-platform.js").Capabilities;
        observations: import("../diagnostics/diagnostics-platform.js").Observation[];
        remediation: string[];
        execution: {
            mode: "host" | "simulation";
            strategy: string;
            elapsed_ms: number;
        };
        checks: {
            system_health: import("../diagnostics/diagnostics-platform.js").DiagnosticResult;
            network: import("../diagnostics/diagnostics-platform.js").DiagnosticResult;
            bluetooth: import("../diagnostics/diagnostics-platform.js").DiagnosticResult;
            services: import("../diagnostics/diagnostics-platform.js").DiagnosticResult[];
        };
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