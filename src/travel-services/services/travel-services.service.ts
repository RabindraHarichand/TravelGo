import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginatedOutputDto } from 'src/shared/dto/paginated-output.dto';
import { CreateServiceDto, UpdateServiceDto } from '../dto/requests';
import { Service } from '../entities/travel-service.entity';
import { ServiceStatus } from '../enum/service-status.enum';
import { ServiceRepository } from '../repositories/travel-service.repository';

@Injectable()
export class TravelServicesService {
  constructor(private readonly serviceRepository: ServiceRepository) {}
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedOutputDto<Service>> {
    try {
      const { page, limit } = paginationDto;
      const totalPages = await this.serviceRepository.count();

      const lastPage = Math.ceil(totalPages / limit);
      const services = await this.serviceRepository.findAll(paginationDto);

      return {
        data: services,
        meta: {
          total: totalPages,
          lastPage: lastPage,
          currentPage: page,
          perPage: limit,
        },
      };
    } catch {
      throw new NotFoundException(`Services not found`);
    }
  }

  async findOneById(id: UUID): Promise<Service> {
    //1. Validar la existencia del servicio de viaje
    const service = await this.serviceRepository.findOneById(id);
    if (!service)
      throw new NotFoundException(`Traveling Service with id ${id} not found`);

    return service;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.create(createServiceDto);

    return { ...service, status: service.status as unknown as ServiceStatus };
  }

  async update(id: UUID, updateServiceDto: UpdateServiceDto) {
    //Se valida la existencia del servicio de viaje
    const travelService = await this.serviceRepository.findOneById(id);
    if (!travelService)
      throw new NotFoundException(`Traveling Service with id ${id} not found`);

    return this.serviceRepository.update(id, updateServiceDto);
  }

  async remove(id: UUID): Promise<Service> {
    //Validates service existance
    const service = await this.serviceRepository.remove(id);

    if (!service)
      throw new NotFoundException(`Traveling Service with id ${id} not found`);

    return service;
  }
}
