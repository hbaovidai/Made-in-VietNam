export declare class CreateBatchDto {
    productId: string;
    batchNumber: string;
    manufactureDate: string;
    expiryDate: string;
    quantity: number;
}
export declare class GenerateQRCodesDto {
    batchId: string;
    count: number;
}
export declare class VerifyQRDto {
    code: string;
    token?: string;
    ipUrl?: string;
}
