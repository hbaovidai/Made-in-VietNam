import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator lấy thông tin user hiện tại từ JWT token.
 *
 * Sử dụng:
 *   @CurrentUser() user: { id: string, email: string, role: string }
 *   @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
