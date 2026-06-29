import { JsonStorageService } from './json-storage.service';
export declare class JsonStorageController {
    private readonly storage;
    constructor(storage: JsonStorageService);
    read(collection: string): {
        error: string;
    } | null;
    write(collection: string, data: any): {
        error: string;
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    };
}
