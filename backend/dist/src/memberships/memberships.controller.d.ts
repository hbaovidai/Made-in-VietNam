import { MembershipsService } from './memberships.service';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
    getPlans(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        price: number;
        billingCycle: string;
        features: string[];
        isActive: boolean;
    }[]>;
    getMySubscription(userId: string, currentUserId: string): Promise<({
        plan: {
            id: string;
            createdAt: Date;
            name: string;
            currency: string;
            price: number;
            billingCycle: string;
            features: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        planId: string;
        startDate: Date;
        endDate: Date;
    }) | null>;
    subscribe(body: {
        planId: string;
    }, userId: string): Promise<{
        plan: {
            id: string;
            createdAt: Date;
            name: string;
            currency: string;
            price: number;
            billingCycle: string;
            features: string[];
            isActive: boolean;
        };
    } & {
        id: string;
        userId: string;
        status: string;
        planId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
