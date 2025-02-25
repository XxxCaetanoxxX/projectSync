import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './hashing/hashing.module';
import { TokenRoleGuard } from './commom/guards/token_role.guard';
import { ArtistModule } from './artists/artists.module';
import { EventModule } from './event/event.module';
import { ArtistEventModule } from './artist_event/artist_event.module';
import { PartyHouseModule } from './party_house/party_house.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [UsersModule, PrismaModule, HashingModule, ArtistModule, EventModule, ArtistEventModule, PartyHouseModule, PdfModule],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: TokenRoleGuard,
    // }
  ],
})
export class AppModule { }
