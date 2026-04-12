import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard kiểm tra role của user.
 * Phải dùng SAU JwtAuthGuard để đảm bảo request.user đã có.
 *
 * Sử dụng:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles('SUPPLIER', 'ADMIN')
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không khai báo @Roles() → cho phép tất cả (chỉ cần đăng nhập)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Không có quyền truy cập');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Vai trò "${user.role}" không có quyền thực hiện hành động này. Yêu cầu: ${requiredRoles.join(' hoặc ')}`,
      );
    }

    return true;
  }
}
