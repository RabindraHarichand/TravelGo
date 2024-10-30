import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class ReservationDetailDto {
  @IsUUID(4)
  serviceId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;
}
