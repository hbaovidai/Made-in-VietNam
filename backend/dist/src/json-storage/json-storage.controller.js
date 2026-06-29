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
exports.JsonStorageController = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("./json-storage.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const ALLOWED_COLLECTIONS = [
    'about',
    'blog-posts',
    'blog-categories',
    'blog-settings',
    'careers',
];
let JsonStorageController = class JsonStorageController {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    read(collection) {
        if (!ALLOWED_COLLECTIONS.includes(collection)) {
            return { error: 'Collection not allowed' };
        }
        return this.storage.read(collection, null);
    }
    write(collection, data) {
        if (!ALLOWED_COLLECTIONS.includes(collection)) {
            return { error: 'Collection not allowed' };
        }
        this.storage.write(collection, data);
        return { success: true };
    }
};
exports.JsonStorageController = JsonStorageController;
__decorate([
    (0, common_1.Get)(':collection'),
    __param(0, (0, common_1.Param)('collection')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JsonStorageController.prototype, "read", null);
__decorate([
    (0, common_1.Put)(':collection'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('collection')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JsonStorageController.prototype, "write", null);
exports.JsonStorageController = JsonStorageController = __decorate([
    (0, common_1.Controller)('json-storage'),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], JsonStorageController);
//# sourceMappingURL=json-storage.controller.js.map