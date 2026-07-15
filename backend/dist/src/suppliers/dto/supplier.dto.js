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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFakeSuppDto = exports.CategoryOption = exports.AdminQueryDto = exports.SupplierQueryDto = exports.UpdateSupplierDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class UpdateSupplierDto {
    companyName;
    description;
    logo;
    banner;
    businessType;
    yearEstablished;
    employee_count;
    primaryLocation;
    website;
    taxCode;
    companyEmail;
    companyPhone;
    legalRepName;
    legalRepPhone;
    businessLicenseUrl;
    identityCardUrl;
    status;
    industries;
    markets;
}
exports.UpdateSupplierDto = UpdateSupplierDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "logo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "banner", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.BusinessType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "businessType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateSupplierDto.prototype, "yearEstablished", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "employee_count", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "primaryLocation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "taxCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "companyEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "companyPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "legalRepName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "legalRepPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSupplierDto.prototype, "businessLicenseUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "identityCardUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SupplierStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSupplierDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSupplierDto.prototype, "industries", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSupplierDto.prototype, "markets", void 0);
class SupplierQueryDto {
    search;
    industry;
    categorySlug;
    page = 1;
    limit = 20;
    businessType;
    status;
}
exports.SupplierQueryDto = SupplierQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierQueryDto.prototype, "industry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierQueryDto.prototype, "categorySlug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SupplierQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SupplierQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.BusinessType),
    __metadata("design:type", String)
], SupplierQueryDto.prototype, "businessType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SupplierStatus),
    __metadata("design:type", String)
], SupplierQueryDto.prototype, "status", void 0);
class AdminQueryDto {
    slugOrId;
    status;
    include;
}
exports.AdminQueryDto = AdminQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminQueryDto.prototype, "slugOrId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SupplierStatus),
    __metadata("design:type", String)
], AdminQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateSupplierDto),
    __metadata("design:type", UpdateSupplierDto)
], AdminQueryDto.prototype, "include", void 0);
class CategoryOption {
    id;
    slug;
    name;
    included;
}
exports.CategoryOption = CategoryOption;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryOption.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryOption.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryOption.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CategoryOption.prototype, "included", void 0);
class CreateFakeSuppDto {
    companyName;
    taxCode;
    primaryLocation;
    businessType;
    contactPhone;
    contactEmail;
    accountHolderRole;
    supplierType;
    categoryOptions;
    website;
    facebook;
    instagram;
    shopee;
    logo;
    banner;
}
exports.CreateFakeSuppDto = CreateFakeSuppDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "taxCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "primaryLocation", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.BusinessType),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "businessType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "contactPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SupplierAccountHolderRole),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "accountHolderRole", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SupplierType),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "supplierType", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategoryOption),
    __metadata("design:type", Array)
], CreateFakeSuppDto.prototype, "categoryOptions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "facebook", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "instagram", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "shopee", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "logo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFakeSuppDto.prototype, "banner", void 0);
//# sourceMappingURL=supplier.dto.js.map