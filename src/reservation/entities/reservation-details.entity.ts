import { IsNumber, IsPositive, IsUUID } from 'class-validator';
import { Service } from 'src/travel-services/entities/travel-service.entity';

export class ReservationDetails {
  serviceId: string;

  quantity: number;

  unitPrice: number;
}
