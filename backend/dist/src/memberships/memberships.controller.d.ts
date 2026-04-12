import { MembershipsService } from './memberships.service';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
    getPlans(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        currency: string;
        price: number;
        billingCycle: string;
        features: string[];
        isActive: boolean;
    }[]>;
    getMySubscription(userId: string): Promise<({
        plan: {
            id: string;
            name: string;
            createdAt: Date;
            currency: string;
            price: number;
            billingCycle: string;
            features: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        status: string;
        userId: string;
        planId: string;
        startDate: Date;
        endDate: Date;
    }) | null>;
    subscribe(body: {
        userId: string;
        planId: string;
    }): Promise<{
        plan: {
            id: string;
            name: string;
            createdAt: Date;
            currency: string;
            price: number;
            billingCycle: string;
            features: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        status: string;
        userId: string;
        planId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
