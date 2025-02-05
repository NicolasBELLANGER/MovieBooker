import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';
import { ReservationModule } from './reservation/reservation.module';
@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot(), MovieModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
