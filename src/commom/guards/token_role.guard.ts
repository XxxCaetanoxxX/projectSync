import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class TokenRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Permite rotas públicas
    if (this.isPublicRoute(context)) return true;

    // Verifica roles exigidos
    const requiredRoles = this.getRequiredRoles(context);
    if (!requiredRoles) return true;

    // Extrai o token
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Token not found!');

    // Valida token e atribui user à request
    const user = this.validateToken(token, context);
    request['user'] = user;

    // Verifica permissões
    if (!this.hasRequiredRoles(user, requiredRoles))
      throw new ForbiddenException('You dont have permission to access this route!');

    return true;
  }

  private extractToken(request: any) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>('isPublic', context.getHandler()) ?? false;
  }

  private getRequiredRoles(context: ExecutionContext): string[] | null {
    return this.reflector.get<string[]>('roles', context.getHandler()) ?? [];
  }

  private validateToken(token: string, context: ExecutionContext) {
    const expectedType = this.reflector.get<'access' | 'refresh'>('tokenType', context.getHandler()) || 'access';
    const secret = expectedType === 'refresh'
      ? process.env.JWT_REFRESH_SECRET
      : process.env.JWT_ACCESS_SECRET;

    try {
      const verified = jwt.verify(token, secret) as any;
      if (verified.type !== expectedType) {
        throw new UnauthorizedException(`Invalid token type for this route! Expected ${expectedType}`);
      }
      return verified;
    } catch {
      throw new UnauthorizedException('Invalid or expired token!');
    }
  }

  private hasRequiredRoles(user: any, requiredRoles: string[]): boolean {
    if (!requiredRoles?.length) return true;
    return requiredRoles.some((role) => user.role === role);
  }
}
