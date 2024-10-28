import { Service } from '../entities/travel-service.entity';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ServiceStatus } from '../enum/service-status.enum';
import { CreateServiceDto, UpdateServiceDto } from '../dto/requests';
import { PrismaClient } from '@prisma/client';
import { Logger, OnModuleInit } from '@nestjs/common';

export class ServiceRepository extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ServiceRepository');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async count() {
    return await this.service.count({ where: { status: 'Active' } });
  }

  async findAll(paginationDto: PaginationDto): Promise<Service[]> {
    const services = await this.service.findMany({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
      where: { status: 'Active' },
    });

    return services.map((service) => {
      return {
        ...service,
        status: service.status as unknown as ServiceStatus,
      };
    });
  }

  async findOneById(id: string): Promise<Service> {
    const service = await this.service.findFirst({
      where: { id, status: 'Active' },
    });

    return {
      ...service,
      status: service.status as unknown as ServiceStatus,
    };
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = await this.service.create({
      data: createServiceDto,
    });

    return { ...service, status: service.status as unknown as ServiceStatus };
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.service.update({
      where: { id },
      data: updateServiceDto,
    });

    return { ...service, status: service.status as unknown as ServiceStatus };
  }

  async remove(id: string): Promise<Service> {
    const service = await this.service.update({
      where: { id },
      data: { status: 'Disabled' },
    });

    return { ...service, status: service.status as unknown as ServiceStatus };
  }
}
