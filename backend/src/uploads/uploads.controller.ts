import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cấu hình lưu file vào bộ nhớ đệm (RAM) trước khi đẩy lên Supabase
const storage = memoryStorage();

// Chấp nhận file ảnh (JPG, PNG, WEBP, GIF) và tài liệu (PDF)
const allowedFileFilter = (_req: any, file: any, cb: any) => {
  if (
    !file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf)$/) &&
    file.mimetype !== 'application/pdf'
  ) {
    return cb(
      new BadRequestException(
        'Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF) hoặc tài liệu (PDF)',
      ),
      false,
    );
  }
  cb(null, true);
};

@Controller('uploads')
export class UploadsController {
  private supabase: SupabaseClient | null = null;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (url && key) {
      this.supabase = createClient(url, key);
    } else {
      console.warn(
        '⚠ SUPABASE_URL / SUPABASE_SERVICE_KEY chưa được cấu hình. Upload sẽ không hoạt động.',
      );
    }
  }

  private async processUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp để tải lên');
    }

    if (!this.supabase) {
      throw new InternalServerErrorException(
        'Chưa cấu hình Supabase Storage. Vui lòng liên hệ Admin.',
      );
    }

    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;

    try {
      // 1. Upload file lên Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('uploads')
        .upload(uniqueName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new InternalServerErrorException('Lỗi tải tệp lên cloud');
      }

      // 2. Lấy URL công khai
      const { data: publicUrlData } = this.supabase.storage
        .from('uploads')
        .getPublicUrl(uniqueName);

      // 3. Trả về thông tin cho Frontend
      return {
        url: publicUrlData.publicUrl,
        filename: uniqueName,
        size: file.size,
      };
    } catch (err) {
      console.error('Upload failed:', err);
      throw new InternalServerErrorException('Lỗi hệ thống khi tải tệp');
    }
  }

  // 1. Endpoint Upload Chung (Yêu cầu phải đăng nhập)
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: allowedFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.processUpload(file);
  }

  // 2. Endpoint Upload Công Khai dành riêng cho Form Đăng Ký Nhà Cung Cấp
  // Trang bị Rate Limiter: Tối đa 10 upload / 1 phút / 1 IP để chống Spam / DoS Storage
  @Post('public-registration')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: allowedFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadRegistrationFile(@UploadedFile() file: Express.Multer.File) {
    return this.processUpload(file);
  }
}

