import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<Record<string, string>>;
    update(body: Record<string, string>): Promise<Record<string, string>>;
}
