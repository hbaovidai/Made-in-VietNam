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
exports.RfqController = void 0;
const common_1 = require("@nestjs/common");
const rfq_service_1 = require("./rfq.service");
let RfqController = class RfqController {
    rfqService;
    constructor(rfqService) {
        this.rfqService = rfqService;
    }
    getOpenRFQs() {
        return this.rfqService.getOpenRFQs();
    }
    getBuyerRFQs(buyerId) {
        return this.rfqService.getBuyerRFQs(buyerId);
    }
    getRFQDetails(id) {
        return this.rfqService.getRFQDetails(id);
    }
    createRFQ(body) {
        const { buyerId, ...dto } = body;
        return this.rfqService.createRFQ(buyerId, dto);
    }
    submitQuote(body) {
        const { supplierId, ...dto } = body;
        return this.rfqService.submitQuote(supplierId, dto);
    }
};
exports.RfqController = RfqController;
__decorate([
    (0, common_1.Get)('open'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "getOpenRFQs", null);
__decorate([
    (0, common_1.Get)('buyer/:buyerId'),
    __param(0, (0, common_1.Param)('buyerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "getBuyerRFQs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "getRFQDetails", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "createRFQ", null);
__decorate([
    (0, common_1.Post)('quotes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "submitQuote", null);
exports.RfqController = RfqController = __decorate([
    (0, common_1.Controller)('rfqs'),
    __metadata("design:paramtypes", [rfq_service_1.RfqService])
], RfqController);
//# sourceMappingURL=rfq.controller.js.map