/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { AuthErrors } from 'src/common/constants/errors/auth.error';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: () => void) {
    const userId = Number(req.headers?.['x-user-id']);
    if (!userId) throw new HttpException(AuthErrors.UNAUTHORIZED, 401);

    try {
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { id: userId },
      });

      req.user = user;

      next();
    } catch {
      throw new HttpException(AuthErrors.UNAUTHORIZED, 401);
    }
  }
}
