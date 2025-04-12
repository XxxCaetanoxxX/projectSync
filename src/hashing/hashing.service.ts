import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {

  async encrypt(password: string) {
    return await bcrypt.hash(password, 10)
  }

  async compare(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash)
  }
}
