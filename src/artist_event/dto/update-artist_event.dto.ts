import { PartialType } from '@nestjs/swagger';
import { CreateArtistEventDto } from './create-artist_event.dto';

export class UpdateArtistEventDto extends PartialType(CreateArtistEventDto) { }
