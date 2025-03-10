import { PartialType } from '@nestjs/swagger';
import { CreatePartyHouseDto } from './create-party_house.dto';

export class UpdatePartyHouseDto extends PartialType(CreatePartyHouseDto) { }
