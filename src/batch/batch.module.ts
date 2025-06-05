import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BatchController],
  providers: [BatchService],
  imports: [PrismaModule]
})
export class BatchModule {}
