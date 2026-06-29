export declare class JsonStorageService {
    private readonly logger;
    private readonly dataDir;
    constructor();
    private getFilePath;
    read<T = any>(collection: string, defaultData: T): T;
    write<T = any>(collection: string, data: T): void;
}
