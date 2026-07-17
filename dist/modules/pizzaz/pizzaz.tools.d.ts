import { ExecutionContext, z } from '@nitrostack/core';
import { PizzazService } from './pizzaz.service.js';
declare const ShowMapSchema: z.ZodObject<{
    filter: z.ZodOptional<z.ZodEnum<["open_now", "top_rated", "all"]>>;
}, "strip", z.ZodTypeAny, {
    filter?: "open_now" | "top_rated" | "all" | undefined;
}, {
    filter?: "open_now" | "top_rated" | "all" | undefined;
}>;
declare const ShowListSchema: z.ZodObject<{
    openNow: z.ZodOptional<z.ZodBoolean>;
    minRating: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    openNow?: boolean | undefined;
    minRating?: number | undefined;
    maxPrice?: number | undefined;
}, {
    openNow?: boolean | undefined;
    minRating?: number | undefined;
    maxPrice?: number | undefined;
}>;
declare const ShowShopSchema: z.ZodObject<{
    shopId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    shopId: string;
}, {
    shopId: string;
}>;
export declare class PizzazTools {
    private readonly pizzazService;
    constructor(pizzazService: PizzazService);
    showPizzaMap(args: z.infer<typeof ShowMapSchema>, ctx: ExecutionContext): Promise<{
        shops: import("./pizzaz.data.js").PizzaShop[];
        filter: "open_now" | "top_rated" | "all";
        totalShops: number;
    }>;
    showPizzaList(args: z.infer<typeof ShowListSchema>, ctx: ExecutionContext): Promise<{
        shops: import("./pizzaz.data.js").PizzaShop[];
        filters: {
            openNow?: boolean | undefined;
            minRating?: number | undefined;
            maxPrice?: number | undefined;
        };
        totalShops: number;
    }>;
    showPizzaShop(args: z.infer<typeof ShowShopSchema>, ctx: ExecutionContext): Promise<{
        shop: import("./pizzaz.data.js").PizzaShop;
        relatedShops: import("./pizzaz.data.js").PizzaShop[];
    }>;
}
export {};
//# sourceMappingURL=pizzaz.tools.d.ts.map