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
exports.SupplierApplicationController = void 0;
const common_1 = require("@nestjs/common");
const supplier_app_service_1 = require("./supplier_app.service");
const supplier_app_dto_1 = require("./dto/supplier_app.dto");
const roles_guard_1 = require("../auth/guards/roles.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const supplier_app_service_2 = require("./supplier_app.service");
let SupplierApplicationController = class SupplierApplicationController {
    suppAppService;
    constructor(suppAppService) {
        this.suppAppService = suppAppService;
    }
    async getAllApplications(query) {
        return this.suppAppService.findAll(query);
    }
    async deleteApplication(id) {
        const result = await this.suppAppService.deleteApplication(id);
        return result;
    }
    async updateApplicationStatus(id, newStatus) {
        const result = await this.suppAppService.updateApplicationStatus(id, newStatus);
        return result;
    }
};
exports.SupplierApplicationController = SupplierApplicationController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Post)('/supp_apps_all'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_app_dto_1.SupplierApplicationDto]),
    __metadata("design:returntype", Promise)
], SupplierApplicationController.prototype, "getAllApplications", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierApplicationController.prototype, "deleteApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Patch)('/:id/:newStatus'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('newStatus', new common_1.ParseEnumPipe(supplier_app_service_2.SupplierApplicationStatus))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SupplierApplicationController.prototype, "updateApplicationStatus", null);
exports.SupplierApplicationController = SupplierApplicationController = __decorate([
    (0, common_1.Controller)('supp_apps'),
    __metadata("design:paramtypes", [supplier_app_service_1.SupplierApplicationService])
], SupplierApplicationController);
//# sourceMappingURL=supplier_app.controller.js.map