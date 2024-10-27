import { Module } from '@nestjs/common';
import { TravelServicesModule } from './travel-services/travel-services.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [TravelServicesModule, SharedModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
