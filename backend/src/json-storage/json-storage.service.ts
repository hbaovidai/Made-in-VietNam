import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonStorageService {
  private readonly logger = new Logger(JsonStorageService.name);
  private readonly dataDir = path.join(process.cwd(), 'data');

  constructor() {
    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getFilePath(collection: string): string {
    // Sanitize collection name to prevent path traversal
    const safe = collection.replace(/[^a-zA-Z0-9_-]/g, '');
    return path.join(this.dataDir, `${safe}.json`);
  }

  read<T = any>(collection: string, defaultData: T): T {
    const filePath = this.getFilePath(collection);
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      this.logger.warn(`Error reading ${collection}.json: ${err.message}`);
    }
    // Initialize with default data if file doesn't exist
    this.write(collection, defaultData);
    return defaultData;
  }

  write<T = any>(collection: string, data: T): void {
    const filePath = this.getFilePath(collection);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      this.logger.error(`Error writing ${collection}.json: ${err.message}`);
      throw err;
    }
  }
}
