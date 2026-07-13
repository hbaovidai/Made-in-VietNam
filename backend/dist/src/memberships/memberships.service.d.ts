import { PrismaService } from '../prisma/prisma.service';
export declare class MembershipsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    getMySubscription(userId: string): Promise<({
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
        status: string;
        userId: string;
        planId: string;
        startDate: Date;
        endDate: Date;
    }) | null>;
    subscribe(userId: string, planId: string): Promise<{
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
        status: string;
        userId: string;
        planId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
