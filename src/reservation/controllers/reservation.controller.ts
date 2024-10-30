import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateReservationDto } from '../dto/requests/create-reservation.dto';
import { UpdateReservationDto } from '../dto/requests/update-reservation-status.dto';
import { ReservationService } from '../services/reservation.service';
import { RequestReservationsForCurrentUser } from '../dto/requests/request-reservations-for-current-user.dto';
import { PaginationDto } from 'src/shared/dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAllReservationsForCurrentUser(
    @Body()
    requestReservationsForCurrentUser: RequestReservationsForCurrentUser,
  ) {
    return this.reservationService.findAllReservationsForCurrentUser(
      requestReservationsForCurrentUser,
    );
  }

  @Get('user/:id')
  findAllReservationsByUserId(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() paginationDto: PaginationDto,
  ) {
    return this.reservationService.findAllReservationsByUserId(
      id,
      paginationDto,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  updateReservationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.confirmReservation(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.remove(id);
  }
}
