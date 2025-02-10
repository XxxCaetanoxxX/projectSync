import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if(this.isPublicRoute(context)) return true

    const requiredRoles = this.getRequiredRoles(context);
    if (!requiredRoles) return true

    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Token not found!');
    
    const user = this.validateToken(token);
    request['user'] = user

    if(!this.hasRequiredRoles(user, requiredRoles)) throw new ForbiddenException('You dont have permission to access this route!');

    return true;
  }

  extractToken(request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }

  private isPublicRoute(context: ExecutionContext):boolean {
    return this.reflector.get<boolean>('isPublic', context.getHandler()) ?? false;
  }

  private getRequiredRoles(context: ExecutionContext): string[] | null {
    return this.reflector.get<string[]>('roles', context.getHandler()) ?? [];
  }

  private validateToken(token: string) {
    try{
    return jwt.verify(token, process.env.JWT_SECRETY);
    } catch {
      throw new UnauthorizedException('Invalid token!');
    }
  }

  private hasRequiredRoles(user: any, requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0 || undefined || null) return true
    return requiredRoles.some((role) => user.role === role);
  }
}
