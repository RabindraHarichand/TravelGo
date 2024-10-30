import { Module } from '@nestjs/common';
import { TravelServicesModule } from './travel-services/travel-services.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [TravelServicesModule, SharedModule, UserModule, AuthModule, ReservationModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
