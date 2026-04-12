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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getSavedProducts(id) {
        return this.usersService.getSavedProducts(id);
    }
    saveProduct(id, productId) {
        return this.usersService.saveProduct(id, productId);
    }
    unsaveProduct(id, productId) {
        return this.usersService.unsaveProduct(id, productId);
    }
    clearSavedProducts(id) {
        return this.usersService.clearSavedProducts(id);
    }
    getViewHistory(id) {
        return this.usersService.getViewHistory(id);
    }
    recordView(id, productId) {
        return this.usersService.recordView(id, productId);
    }
    deleteHistoryItem(id, historyId) {
        return this.usersService.deleteHistoryItem(id, historyId);
    }
    clearHistory(id) {
        return this.usersService.clearHistory(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(':id/saved'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getSavedProducts", null);
__decorate([
    (0, common_1.Post)(':id/saved'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "saveProduct", null);
__decorate([
    (0, common_1.Delete)(':id/saved/:productId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "unsaveProduct", null);
__decorate([
    (0, common_1.Delete)(':id/saved'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "clearSavedProducts", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getViewHistory", null);
__decorate([
    (0, common_1.Post)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "recordView", null);
__decorate([
    (0, common_1.Delete)(':id/history/:historyId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('historyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteHistoryItem", null);
__decorate([
    (0, common_1.Delete)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "clearHistory", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map