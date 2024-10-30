import { IsDefined, IsObject } from 'class-validator';
import { Auth } from 'src/auth/entities/auth.entity';
import { PaginationDto } from 'src/shared/dto';

export class RequestReservationsForCurrentUser extends PaginationDto {
  @IsDefined()
  @IsObject()
  authUser: Auth;
}
