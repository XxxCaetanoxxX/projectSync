import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = require('jsonwebtoken');
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true


    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Token not found!');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRETY);
      request['user'] = decoded
    } catch {
      throw new UnauthorizedException('Invalid token!');
    }
    return true;
  }

  extractToken(request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }
}
