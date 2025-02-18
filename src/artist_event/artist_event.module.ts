import { Module } from '@nestjs/common';
import { ArtistEventService } from './artist_event.service';
import { ArtistEventController } from './artist_event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistEventController],
  providers: [ArtistEventService],
})
export class ArtistEventModule { }
