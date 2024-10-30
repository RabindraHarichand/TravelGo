import { Module } from '@nestjs/common';
import { TravelServicesController } from './controllers/travel-services.controller';
import { TravelServicesService } from './services/travel-services.service';
import { ServiceRepository } from './repositories/travel-service.repository';

@Module({
  controllers: [TravelServicesController],
  providers: [TravelServicesService, ServiceRepository],
  exports: [TravelServicesService],
})
export class TravelServicesModule {}
