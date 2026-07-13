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
exports.SupplierRegisterDto = exports.GoogleLoginDto = exports.ChangePasswordDto = exports.UpdateProfileDto = exports.LoginDto = exports.UserRegisterDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class UserRegisterDto {
    email;
    password;
    fullName;
    role;
    phone;
    status;
}
exports.UserRegisterDto = UserRegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Mật khẩu tối thiểu 6 ký tự' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên không được để trống' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsIn)([client_1.Role.BUYER, client_1.Role.SUPPLIER], { message: 'Role phải là BUYER hoặc SUPPLIER' }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.UserStatus),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "status", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu không được để trống' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class UpdateProfileDto {
    fullName;
    phone;
    avatar;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar", void 0);
class ChangePasswordDto {
    oldPassword;
    newPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu cũ không được để trống' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "oldPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class GoogleLoginDto {
    credential;
    email;
    name;
    picture;
}
exports.GoogleLoginDto = GoogleLoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GoogleLoginDto.prototype, "credential", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], GoogleLoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GoogleLoginDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GoogleLoginDto.prototype, "picture", void 0);
class SupplierRegisterDto {
    companyName;
    taxCode;
    legalRepName;
    legalRepGovId;
    primaryLocation;
    businessType;
    legalRepGovIdUrl;
    businessLicenseUrl;
    accountHolderName;
    contactPhone;
    contactEmail;
    accountHolderRole;
    authorizationLetterUrl;
    supplierType;
    extraDocsUrl;
}
exports.SupplierRegisterDto = SupplierRegisterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "taxCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "legalRepName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "legalRepGovId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "primaryLocation", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.BusinessType),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "businessType", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SupplierRegisterDto.prototype, "legalRepGovIdUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SupplierRegisterDto.prototype, "businessLicenseUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "accountHolderName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "contactPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SupplierAccountHolderRole),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "accountHolderRole", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SupplierRegisterDto.prototype, "authorizationLetterUrl", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SupplierType),
    __metadata("design:type", String)
], SupplierRegisterDto.prototype, "supplierType", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SupplierRegisterDto.prototype, "extraDocsUrl", void 0);
//# sourceMappingURL=auth.dto.js.map