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
exports.SupplierApplicationService = exports.SupplierApplicationStatus = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
var SupplierApplicationStatus;
(function (SupplierApplicationStatus) {
    SupplierApplicationStatus["PENDING"] = "PENDING";
    SupplierApplicationStatus["REJECTED"] = "REJECTED";
    SupplierApplicationStatus["APPROVED"] = "APPROVED";
})(SupplierApplicationStatus || (exports.SupplierApplicationStatus = SupplierApplicationStatus = {}));
let SupplierApplicationService = class SupplierApplicationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 20 } = query;
        const where = {};
        if (query.id)
            where.id = query.id;
        const [supp_apps, total_apps_count] = await Promise.all([
            this.prisma.supplier_applications.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    status: 'asc',
                },
                where: where,
            }),
            this.prisma.supplier_applications.count({}),
        ]);
        return {
            data: supp_apps,
            meta: {
                total_apps_count,
                page,
                limit,
                total_pages: Math.ceil(total_apps_count / limit),
            },
        };
    }
    async deleteApplication(id) {
        try {
            const deleted_user = await this.prisma.supplier_applications.delete({
                where: {
                    id: id,
                },
            });
            return {
                success: true,
                deletedUser: deleted_user,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                return {
                    success: false,
                    reason: `User with id ${id} doesn't exist.`,
                };
            }
            throw new common_1.InternalServerErrorException('Something went wrong on the server.');
        }
    }
    async updateApplicationStatus(id, newStatus) {
        try {
            const updatedApplication = await this.prisma.supplier_applications.update({
                data: {
                    status: newStatus,
                },
                where: {
                    id,
                },
            });
            return {
                success: true,
                updatedApplication,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                return {
                    success: false,
                    reason: 'Application does not exist.',
                };
            }
            throw new common_1.InternalServerErrorException('Something went wrong on the server.');
        }
    }
};
exports.SupplierApplicationService = SupplierApplicationService;
exports.SupplierApplicationService = SupplierApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupplierApplicationService);
//# sourceMappingURL=supplier_app.service.js.map