import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

/**
 * Autorise uniquement les comptes dont le rôle est ADMIN.
 * À utiliser après JwtAuthGuard, qui renseigne request.user.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }
    return true;
  }
}
