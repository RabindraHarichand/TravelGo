import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import envs from './config/envs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envs],
    }),
  ],
  exports: [ConfigModule],
  providers: [],
})
export class SharedModule {}
