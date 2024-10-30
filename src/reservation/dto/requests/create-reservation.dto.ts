import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationDetailDto } from './reservation-service.dto';

export class CreateReservationDto {
  @IsUUID(4)
  @IsOptional()
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReservationDetailDto)
  items: ReservationDetailDto[];
}
