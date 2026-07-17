export interface PizzaShop {
    id: string;
    name: string;
    description: string;
    address: string;
    coords: [number, number];
    rating: number;
    reviews: number;
    priceLevel: 1 | 2 | 3;
    cuisine: string[];
    hours: {
        open: string;
        close: string;
    };
    phone: string;
    website?: string;
    image: string;
    specialties: string[];
    openNow: boolean;
}
export declare const PIZZA_SHOPS: PizzaShop[];
//# sourceMappingURL=pizzaz.data.d.ts.map