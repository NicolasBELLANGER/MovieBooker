import { Controller, Post, Body, UseGuards} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from 'src/auth/auth.gard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/reservation.dto';

@Controller('reservation')
export class ReservationController {
    constructor( private readonly reservationService : ReservationService) {}

    @UseGuards(AuthGuard)
        @Post()
        @ApiBearerAuth()
        async createReservation(@Body()data:CreateReservationDto) {
            return this.reservationService.createReservation(data);
        }
}
