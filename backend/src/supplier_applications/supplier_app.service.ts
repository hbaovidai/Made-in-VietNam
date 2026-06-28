import { 
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SupplierApplicationDto } from "./dto/supplier_app.dto";
import { Prisma, SupplierStatus } from "@prisma/client";

@Injectable()
export class SupplierApplicationService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SupplierApplicationDto) {
    const {page = 1, limit = 20} = query;

    const where: Prisma.SupplierWhereInput = {};
    if (query.id) where.id = query.id;
    where.status = {in: [SupplierStatus.UNVERIFIED, SupplierStatus.APPLICATION_REJECTED]};

    const [supp_apps, total_apps_count] = await Promise.all([
      this.prisma.supplier.findMany({
        take: limit,
        skip: (page-1) * limit,
        orderBy: {
          status: 'asc'
        },
        where: where
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      data: supp_apps,
      meta: {
        total_apps_count, page,
        limit, total_pages: Math.ceil(total_apps_count/limit)
      }
    }
  }

  async deleteApplication(id: string) {
    try {
      const deleted_user = await this.prisma.supplier.delete({
        where: {
          id: id
        }
      });

      return {
        success: true,
        deletedUser: deleted_user 
      }

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          success: false,
          reason: `User with id ${id} doesn't exist.`
        }
      }

      throw new InternalServerErrorException('Something went wrong on the server.');
    }
  }

  async updateApplicationStatus(id: string, newStatus: SupplierStatus) {
    try {
      const updatedApplication = await this.prisma.supplier.update({
        data: {
          status: newStatus
        },
        where: {
          id
        },
      });
      
      return {
        success: true,
        updatedApplication
      }

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return {
          success: false,
          reason: 'Application does not exist.'
        }
      }

      throw new InternalServerErrorException('Something went wrong on the server.');
    }
  }
}
