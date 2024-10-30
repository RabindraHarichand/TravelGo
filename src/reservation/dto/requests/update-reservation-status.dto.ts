import { IsEnum, IsUUID } from 'class-validator';
import {
  ReservationStatus,
  ReservationStatusList,
} from '../../enum/reservation-status.enum';

export class UpdateReservationDto {
  @IsEnum(ReservationStatusList, {
    message: `Valid status are ${ReservationStatusList}`,
  })
  status: ReservationStatus;
}
