import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getSavedProducts(id: string): Promise<any[]>;
    saveProduct(id: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    } | {
        success: boolean;
    }>;
    unsaveProduct(id: string, productId: string): Promise<{
        success: boolean;
    }>;
    clearSavedProducts(id: string): Promise<{
        success: boolean;
    }>;
    getViewHistory(id: string): Promise<any[]>;
    recordView(id: string, productId: string): Promise<{
        id: string;
        userId: string;
        productId: string;
        viewedAt: Date;
    }>;
    deleteHistoryItem(id: string, historyId: string): Promise<{
        success: boolean;
    }>;
    clearHistory(id: string): Promise<{
        success: boolean;
    }>;
}
