import { PartialType } from '@nestjs/mapped-types';
import { CreatePartyHouseDto } from './create-party_house.dto';

export class UpdatePartyHouseDto extends PartialType(CreatePartyHouseDto) {}
