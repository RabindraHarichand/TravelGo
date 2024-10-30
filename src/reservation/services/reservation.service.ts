import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto, UpdateReservationDto } from '../dto/requests';
import { TravelServicesService } from 'src/travel-services/services/travel-services.service';
import { ReservationRepository } from '../repositories/reservation.repository';
import { Reservation } from '../entities/reservation.entity';
import { ReservationStatus } from '../enum/reservation-status.enum';
import { RequestReservationsForCurrentUser } from '../dto/requests/request-reservations-for-current-user.dto';
import { PaginatedOutputDto, PaginationDto } from 'src/shared/dto';

@Injectable()
export class ReservationService {
  constructor(
    @Inject() private readonly service: TravelServicesService,
    @Inject() private readonly reservationRepository: ReservationRepository,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    //Verify services ids
    const serviceIds = createReservationDto.items.map((item) => item.serviceId);
    const services = await this.service.validateServices(serviceIds);

    //Calculate total amount and total services for a Reservation
    const totalAmount = createReservationDto.items.reduce(
      (acc, serviceItem) => {
        const price = services.find(
          (service) => service.id === serviceItem.serviceId,
        ).price;

        return acc + price * serviceItem.quantity;
      },
      0,
    );

    const totalServices = createReservationDto.items.reduce(
      (acc, serviceItem) => {
        return acc + serviceItem.quantity;
      },
      0,
    );

    //Save reservation
    const reservationToSave: Omit<Reservation, 'id'> = {
      userId: createReservationDto.userId,
      date: new Date(),
      status: ReservationStatus.PENDING,
      totalAmount: totalAmount,
      totalServices: totalServices,
      reservationDetails: createReservationDto.items.map(
        (reservationDetail) => {
          return {
            serviceId: reservationDetail.serviceId,

            quantity: reservationDetail.quantity,

            unitPrice: services.find(
              (service) => service.id == reservationDetail.serviceId,
            ).price,
          };
        },
      ),
    };
    const reservation =
      await this.reservationRepository.createReservation(reservationToSave);
    return reservation;
  }

  async findAllReservationsForCurrentUser(
    requestReservationsForCurrentUser: RequestReservationsForCurrentUser,
  ): Promise<PaginatedOutputDto<Reservation>> {
    const userId = requestReservationsForCurrentUser.authUser.id;
    const paginationDto: PaginationDto = {
      page: requestReservationsForCurrentUser.page,
      limit: requestReservationsForCurrentUser.limit,
    };

    let reservations: Reservation[];
    let totalReservations: number;

    try {
      //get total user reservations
      totalReservations =
        await this.reservationRepository.countByUserId(userId);

      //get user reservations
      reservations = await this.reservationRepository.findRangeByUserId(
        userId,
        paginationDto,
      );
    } catch {
      throw new BadRequestException(
        'Orders could not be retrieved because an unexpected error occurred',
        'An error occurred while retrieving orders',
      );
    }

    return {
      data: reservations,
      meta: {
        total: totalReservations,
        lastPage: Math.ceil(
          totalReservations / requestReservationsForCurrentUser.limit,
        ),
        currentPage: requestReservationsForCurrentUser.page,
        perPage: requestReservationsForCurrentUser.limit,
      },
    };
  }

  async findAllReservationsByUserId(
    id: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedOutputDto<Reservation>> {
    const userId = id;
    const { page, limit } = paginationDto;
    let reservations: Reservation[];
    let totalReservations: number;

    //Verfy if user specified by id exist
    const IsUser = await this.reservationRepository.existsById(id);
    if (!IsUser)
      throw new NotFoundException(
        `User with id: ${id} does not exist`,
        'An error occurred while verifying the user',
      );

    try {
      //get total user reservations
      totalReservations =
        await this.reservationRepository.countByUserId(userId);

      //get user reservations
      reservations = await this.reservationRepository.findRangeByUserId(
        userId,
        paginationDto,
      );
    } catch {
      throw new BadRequestException(
        'Reservations could not be retrieved because an unexpected error occurred',
        'An error occurred while retrieving reservations',
      );
    }

    return {
      data: reservations,
      meta: {
        total: totalReservations,
        lastPage: Math.ceil(totalReservations / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async findOne(id: string): Promise<Reservation> {
    let reservation: Reservation | null;
    try {
      reservation = await this.reservationRepository.findById(id);
    } catch {
      throw new NotFoundException(
        `Reservation by id: ${id} could not be retrieved because an unexpected error occurred`,
        'An error occurred while retrieving a reservation',
      );
    }

    if (!reservation)
      throw new NotFoundException(
        `Reservation by id: ${id} could not be retrieved because an unexpected error occurred`,
        'An error occurred while retrieving a reservation',
      );

    return reservation;
  }

  async confirmReservation(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    //Verify current reservation status
    const currentReservation = await this.reservationRepository.findById(id);

    if (updateReservationDto.status === currentReservation.status)
      throw new BadRequestException(
        `Reservation status is already set to the specified status`,
        'An error occurred while updating a reservation',
      );

    if (currentReservation.status === 'CANCELLED')
      throw new ForbiddenException(
        `Reservation by id: ${id} has been cancelled and its status cannot be modified`,
        'An error occurred while updating a reservation',
      );

    if (
      currentReservation.status === 'ACTIVE' &&
      updateReservationDto.status === 'PENDING'
    )
      throw new ForbiddenException(
        `Reservation by id: ${id} is active and its status cannot be set back to pending.`,
        'An error occurred while updating a reservation',
      );

    if (
      currentReservation.status === ReservationStatus.PENDING &&
      updateReservationDto.status === ReservationStatus.ACTIVE
    ) {
      try {
        await this.reservationRepository.updateReservationStatusById(
          id,
          updateReservationDto.status,
        );
      } catch {
        throw new BadRequestException(
          `Reservation status could not be updated because an unexpected error occurred`,
          'An error occurred while updating a reservation',
        );
      }
    }

    if (
      currentReservation.status === ReservationStatus.PENDING &&
      updateReservationDto.status === ReservationStatus.CANCELLED
    ) {
      try {
        await this.reservationRepository.updateReservationStatusById(
          id,
          updateReservationDto.status,
        );
      } catch {
        throw new BadRequestException(
          `Reservation status could not be updated because an unexpected error occurred`,
          'An error occurred while updating a reservation',
        );
      }
    }

    if (
      currentReservation.status === ReservationStatus.ACTIVE &&
      updateReservationDto.status === ReservationStatus.CANCELLED
    ) {
      try {
        await this.reservationRepository.updateReservationStatusById(
          id,
          updateReservationDto.status,
        );
      } catch {
        throw new BadRequestException(
          `Reservation status could not be updated because an unexpected error occurred`,
          'An error occurred while updating a reservation',
        );
      }
    }

    const updatedReservation = await this.reservationRepository.findById(id);
    if (!updatedReservation)
      throw new NotFoundException(
        `Reservation by id: ${id} could not be retrieved because an unexpected error occurred`,
        'An error occurred while retrieving a reservation',
      );

    return updatedReservation;
  }

  async remove(id: string): Promise<string> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation)
      throw new NotFoundException(
        `Reservation by id: ${id} could not be found because an unexpected error occurred`,
        'An error occurred while retrieving a reservation',
      );

    try {
      await this.reservationRepository.removeById(id);
    } catch {
      throw new BadRequestException(
        `Reservation could not be deleted because an unexpected error occurred`,
        'An error occurred while deleting a reservation',
      );
    }
    return `Reservation #${id} has been removed`;
  }
}
