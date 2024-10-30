import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  ReservationStatus,
  ReservationStatusList,
} from '../enum/reservation-status.enum';
import { ReservationDetails } from './reservation-details.entity';
import { Type } from 'class-transformer';
import { ReservationDetailDto } from '../dto/requests';

export class Reservation {
  id: string;

  userId: string;

  date: Date;

  totalAmount: number;

  totalServices: number;

  status: ReservationStatus;

  reservationDetails: ReservationDetails[];
}
