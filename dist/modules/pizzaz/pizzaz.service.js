var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
import { PIZZA_SHOPS } from './pizzaz.data.js';
let PizzazService = class PizzazService {
    /**
     * Get all pizza shops
     */
    getAllShops() {
        return PIZZA_SHOPS;
    }
    /**
     * Get a specific pizza shop by ID
     */
    getShopById(id) {
        return PIZZA_SHOPS.find(shop => shop.id === id);
    }
    /**
     * Get pizza shops filtered by criteria
     */
    getShopsFiltered(filters) {
        let shops = [...PIZZA_SHOPS];
        if (filters.openNow) {
            shops = shops.filter(shop => shop.openNow);
        }
        if (filters.minRating !== undefined) {
            shops = shops.filter(shop => shop.rating >= filters.minRating);
        }
        if (filters.maxPrice !== undefined) {
            shops = shops.filter(shop => shop.priceLevel <= filters.maxPrice);
        }
        if (filters.cuisine) {
            shops = shops.filter(shop => shop.cuisine.some(c => c.toLowerCase().includes(filters.cuisine.toLowerCase())));
        }
        return shops;
    }
    /**
     * Get shops sorted by rating
     */
    getTopRatedShops(limit = 5) {
        return [...PIZZA_SHOPS]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
};
PizzazService = __decorate([
    Injectable()
], PizzazService);
export { PizzazService };
//# sourceMappingURL=pizzaz.service.js.map