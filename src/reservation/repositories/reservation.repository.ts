import { Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Reservation } from '../entities/reservation.entity';
import { ReservationStatus } from '../enum/reservation-status.enum';
import { PaginationDto } from 'src/shared/dto';
import { UpdateReservationDto } from '../dto/requests';

export class ReservationRepository
  extends PrismaClient
  implements OnModuleInit
{
  private readonly logger = new Logger('ReservationRepository');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async createReservation(reservation: Omit<Reservation, 'id'>) {
    const reservationToSave = await this.reservation.create({
      data: {
        userId: reservation.userId,
        totalAmount: reservation.totalAmount,
        totalServices: reservation.totalServices,
        status: reservation.status,
        date: reservation.date,
        Reservation_Details: {
          create: reservation.reservationDetails,
        },
      },
    });

    return reservationToSave;
  }

  async count(): Promise<number> {
    return await this.reservation.count();
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.reservation.count({
      where: {
        userId,
      },
    });
  }

  async findRange(paginationDto: PaginationDto): Promise<Reservation[]> {
    const reservations = await this.reservation.findMany({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      include: {
        Reservation_Details: {
          include: {
            service: true,
          },
        },
      },
    });

    return reservations.map((reservation) => {
      return {
        ...reservation,
        status: reservation.status as unknown as ReservationStatus,
        reservationDetails: reservation.Reservation_Details,
      };
    });
  }

  async findAllByUserId(userId: string): Promise<Reservation[]> {
    const reservations = await this.reservation.findMany({
      where: {
        userId,
      },
      include: {
        Reservation_Details: {
          include: {
            service: true,
          },
        },
      },
    });

    return reservations.map((reservation) => {
      return {
        ...reservation,
        status: reservation.status as unknown as ReservationStatus,
        reservationDetails: reservation.Reservation_Details,
      };
    });
  }

  async findRangeByUserId(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<Reservation[]> {
    const reservations = await this.reservation.findMany({
      where: {
        userId,
      },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      include: {
        Reservation_Details: {
          include: {
            service: true,
          },
        },
      },
    });

    return reservations.map((reservation) => {
      return {
        ...reservation,
        status: reservation.status as unknown as ReservationStatus,
        reservationDetails: reservation.Reservation_Details,
      };
    });
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = await this.reservation.findUnique({
      where: {
        id,
      },
      include: {
        Reservation_Details: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!reservation) return null;

    return {
      ...reservation,
      status: reservation.status as unknown as ReservationStatus,
      reservationDetails: reservation.Reservation_Details,
    };
  }

  async existsById(id: string): Promise<boolean> {
    const resp = await this.user.findUnique({
      where: {
        id,
      },
    });

    if (!resp) return false;
    return true;
  }

  async removeById(id: string): Promise<void> {
    await this.reservation.deleteMany({
      where: {
        id,
      },
    });
    await this.reservation.delete({
      where: {
        id,
      },
    });
  }

  async updateReservationStatusById(
    id: string,
    status: ReservationStatus,
  ): Promise<void> {
    await this.reservation.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
