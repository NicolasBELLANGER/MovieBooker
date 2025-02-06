import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService, PrismaService],
  imports: [JwtModule] 
})
export class ReservationModule {}
