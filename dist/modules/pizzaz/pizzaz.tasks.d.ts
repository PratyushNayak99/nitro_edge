/**
 * Pizzaz Task Tools
 *
 * Demonstrates the MCP Tasks feature — long-running, async tool execution
 * with progress reporting and cancellation support.
 *
 * To test via MCP Inspector (or any MCP client that supports tasks):
 *
 *   tools/call  name="audit_pizza_shops"  task={}
 *   → returns { task: { taskId, status: "working", ... } }
 *
 *   tasks/get   taskId=<id>
 *   → returns current status & progress message
 *
 *   tasks/result  taskId=<id>
 *   → blocks until done, then returns the full audit report
 *
 *   tasks/cancel  taskId=<id>
 *   → cancels the running audit
 */
import { ExecutionContext, z } from '@nitrostack/core';
import { PizzazService } from './pizzaz.service.js';
declare const AuditSchema: z.ZodObject<{
    /** Number of shops to audit. Defaults to all shops. */
    maxShops: z.ZodOptional<z.ZodNumber>;
    /** Simulate a slow audit by adding a delay per shop in ms. */
    delayPerShopMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    delayPerShopMs: number;
    maxShops?: number | undefined;
}, {
    maxShops?: number | undefined;
    delayPerShopMs?: number | undefined;
}>;
declare const OrderPizzaSchema: z.ZodObject<{
    shopId: z.ZodString;
    pizzaName: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    shopId: string;
    pizzaName: string;
    quantity: number;
}, {
    shopId: string;
    pizzaName: string;
    quantity?: number | undefined;
}>;
export declare class PizzazTaskTools {
    private readonly pizzazService;
    constructor(pizzazService: PizzazService);
    /**
     * audit_pizza_shops
     *
     * A long-running tool that audits every pizza shop in the database.
     * It processes each shop one-by-one (with a configurable delay) so you
     * can watch the progress messages update via tasks/get, then fetch the
     * full report via tasks/result.
     *
     * taskSupport: 'optional' — works normally (sync) OR as a task.
     * When invoked without `task: {}`, returns the audit immediately.
     * When invoked with `task: {}`, returns a task handle immediately and
     * runs the audit in the background.
     */
    auditPizzaShops(args: z.infer<typeof AuditSchema>, ctx: ExecutionContext): Promise<{
        summary: {
            totalAudited: number;
            averageScore: number;
            topShop: string;
            completedAt: string;
        };
        results: {
            shopId: string;
            shopName: string;
            score: number;
            grade: string;
            notes: string;
        }[];
    }>;
    /**
     * order_pizza
     *
     * A task-REQUIRED tool — it MUST always be called with task: {} because
     * orders involve payment processing and confirmation steps that take time.
     * This demonstrates the 'required' task support level.
     *
     * Invoke: tools/call  name="order_pizza"  task={}
     *   arguments: { shopId: "bella-napoli", pizzaName: "Margherita", quantity: 2 }
     */
    orderPizza(args: z.infer<typeof OrderPizzaSchema>, ctx: ExecutionContext): Promise<{
        orderId: string;
        status: string;
        shop: string;
        estimatedMinutes: number;
        total: string;
        items: {
            name: string;
            quantity: number;
            price: string;
        }[];
        placedAt: string;
    }>;
}
export {};
//# sourceMappingURL=pizzaz.tasks.d.ts.map