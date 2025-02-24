import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistEventDto } from './create-artist_event.dto';

export class UpdateArtistEventDto extends PartialType(CreateArtistEventDto) {}
