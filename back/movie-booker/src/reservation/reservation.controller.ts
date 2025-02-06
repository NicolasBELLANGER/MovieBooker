import { Controller, Post, Get, Param, Body, Req, UseGuards} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateReservationDto } from './dto/reservation.dto';

@Controller('reservation')
export class ReservationController {
    constructor( private readonly reservationService : ReservationService) {}

    @UseGuards(AuthGuard)
    @Post()
    @ApiBearerAuth()
    async createReservation( @Body() data:CreateReservationDto) {
      
        return this.reservationService.createReservation(data);
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiBearerAuth()
    async getAllReservation(){
        return this.reservationService.getAllReservation()
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiBearerAuth()
    async getReservationById(@Param('id') id: string) {
        return this.reservationService.getReservationById(parseInt(id, 10));
    }
}
