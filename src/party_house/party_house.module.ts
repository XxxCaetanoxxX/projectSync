import { Module } from '@nestjs/common';
import { PartyHouseService } from './party_house.service';
import { PartyHouseController } from './party_house.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PartyHouseController],
  providers: [PartyHouseService],
  imports: [PrismaModule],
})
export class PartyHouseModule { }
