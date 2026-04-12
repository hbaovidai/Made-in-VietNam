import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator khai báo vai trò được phép truy cập endpoint.
 * Dùng kết hợp với RolesGuard.
 *
 * Ví dụ: @Roles('SUPPLIER', 'ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
