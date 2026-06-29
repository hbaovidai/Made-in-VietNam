import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierApplicationDto } from './dto/supplier_app.dto';
import { Prisma } from '@prisma/client';

export enum SupplierApplicationStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

@Injectable()
export class SupplierApplicationService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SupplierApplicationDto) {
    const { page = 1, limit = 20 } = query;

    const where: Prisma.SupplierApplicationWhereInput = {};
    if (query.id) where.id = query.id;

    const [supp_apps, total_apps_count] = await Promise.all([
      this.prisma.supplierApplication.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          status: 'asc',
        },
        where: where,
      }),
      this.prisma.supplierApplication.count({}),
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

  async deleteApplication(id: number) {
    try {
      const deleted_user = await this.prisma.supplierApplication.delete({
        where: {
          id: id,
        },
      });

      return {
        success: true,
        deletedUser: deleted_user,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          success: false,
          reason: `User with id ${id} doesn't exist.`,
        };
      }

      throw new InternalServerErrorException(
        'Something went wrong on the server.',
      );
    }
  }

  async updateApplicationStatus(
    id: number,
    newStatus: SupplierApplicationStatus,
  ) {
    try {
      const updatedApplication = await this.prisma.supplierApplication.update({
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return {
          success: false,
          reason: 'Application does not exist.',
        };
      }

      throw new InternalServerErrorException(
        'Something went wrong on the server.',
      );
    }
  }
}
