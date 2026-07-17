import { type PizzaShop } from './pizzaz.data.js';
export declare class PizzazService {
    /**
     * Get all pizza shops
     */
    getAllShops(): PizzaShop[];
    /**
     * Get a specific pizza shop by ID
     */
    getShopById(id: string): PizzaShop | undefined;
    /**
     * Get pizza shops filtered by criteria
     */
    getShopsFiltered(filters: {
        openNow?: boolean;
        minRating?: number;
        maxPrice?: number;
        cuisine?: string;
    }): PizzaShop[];
    /**
     * Get shops sorted by rating
     */
    getTopRatedShops(limit?: number): PizzaShop[];
}
//# sourceMappingURL=pizzaz.service.d.ts.map