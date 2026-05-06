"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const supabase_js_1 = require("@supabase/supabase-js");
const storage = (0, multer_1.memoryStorage)();
const imageFileFilter = (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new common_1.BadRequestException('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)'), false);
    }
    cb(null, true);
};
let UploadsController = class UploadsController {
    supabase;
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('Vui lòng chọn file ảnh để tải lên');
        }
        const uniqueName = `${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname)}`;
        try {
            const { data, error } = await this.supabase.storage
                .from('uploads')
                .upload(uniqueName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false,
            });
            if (error) {
                console.error('Supabase upload error:', error);
                throw new common_1.InternalServerErrorException('Lỗi tải ảnh lên cloud');
            }
            const { data: publicUrlData } = this.supabase.storage
                .from('uploads')
                .getPublicUrl(uniqueName);
            return {
                url: publicUrlData.publicUrl,
                filename: uniqueName,
                size: file.size,
            };
        }
        catch (err) {
            console.error('Upload failed:', err);
            throw new common_1.InternalServerErrorException('Lỗi hệ thống khi tải ảnh');
        }
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage,
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map