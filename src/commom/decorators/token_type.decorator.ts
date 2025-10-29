// token-type.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const TokenType = (type: 'access' | 'refresh') => SetMetadata('tokenType', type);
