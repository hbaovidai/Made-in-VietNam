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
exports.InquiryBasketController = void 0;
const common_1 = require("@nestjs/common");
const inquiry_basket_service_1 = require("./inquiry-basket.service");
let InquiryBasketController = class InquiryBasketController {
    inquiryBasketService;
    constructor(inquiryBasketService) {
        this.inquiryBasketService = inquiryBasketService;
    }
    getBasket(userId) {
        return this.inquiryBasketService.getBasket(userId);
    }
    addItem(body) {
        const { userId, ...dto } = body;
        return this.inquiryBasketService.addItem(userId, dto);
    }
    removeItem(itemId, userId) {
        return this.inquiryBasketService.removeItem(itemId, userId);
    }
};
exports.InquiryBasketController = InquiryBasketController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InquiryBasketController.prototype, "getBasket", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InquiryBasketController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(':itemId'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InquiryBasketController.prototype, "removeItem", null);
exports.InquiryBasketController = InquiryBasketController = __decorate([
    (0, common_1.Controller)('inquiry-basket'),
    __metadata("design:paramtypes", [inquiry_basket_service_1.InquiryBasketService])
], InquiryBasketController);
//# sourceMappingURL=inquiry-basket.controller.js.map