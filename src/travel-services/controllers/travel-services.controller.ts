import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TravelServicesService } from '../services/travel-services.service';
import { UUID } from 'crypto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginatedOutputDto } from 'src/shared/dto/paginated-output.dto';
import { CreateServiceDto, UpdateServiceDto } from '../dto/requests';
import { Service } from '../entities/travel-service.entity';

@Controller('travel-services')
export class TravelServicesController {
  constructor(private readonly travelService: TravelServicesService) {}

  @Get()
  findAll(
    @Body() paginationDto: PaginationDto,
  ): Promise<PaginatedOutputDto<Service>> {
    return this.travelService.findAll(paginationDto);
  }

  @Get(':id')
  finOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<Service> {
    return this.travelService.findOneById(id);
  }

  @Post()
  createService(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.travelService.create(createServiceDto);
  }

  @Patch(':id')
  updateService(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.travelService.update(id, updateServiceDto);
  }

  @Delete(':id')
  removeService(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.travelService.remove(id);
  }
}
