export declare class TranslationService {
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    constructor();
    translateFields(fields: Record<string, string>): Promise<Record<string, string>>;
    translateProduct(name: string, description?: string): Promise<{
        nameEn?: string;
        descriptionEn?: string;
    }>;
    translateCategory(name: string): Promise<string | undefined>;
}
