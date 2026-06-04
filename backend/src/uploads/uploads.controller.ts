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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cấu hình lưu file vào bộ nhớ đệm (RAM) trước khi đẩy lên Supabase
const storage = memoryStorage();

// Chỉ cho phép ảnh
const imageFileFilter = (_req: any, file: any, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)'), false);
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
      console.warn('⚠ SUPABASE_URL / SUPABASE_SERVICE_KEY chưa được cấu hình. Upload sẽ không hoạt động.');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh để tải lên');
    }

    if (!this.supabase) {
      throw new InternalServerErrorException('Chưa cấu hình Supabase Storage. Vui lòng liên hệ Admin.');
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
        throw new InternalServerErrorException('Lỗi tải ảnh lên cloud');
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
      throw new InternalServerErrorException('Lỗi hệ thống khi tải ảnh');
    }
  }
}
