export declare class UploadsController {
    private supabase;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        size: number;
    }>;
}
