import { Module } from '@nestjs/common';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationService } from './services/reservation.service';
import { TravelServicesModule } from 'src/travel-services/travel-services.module';
import { ReservationRepository } from './repositories/reservation.repository';

@Module({
  imports: [TravelServicesModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
