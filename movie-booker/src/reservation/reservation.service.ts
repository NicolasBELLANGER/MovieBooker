import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';
import { PrismaService } from '../prisma.service';
import { addHours, isBefore } from 'date-fns';
@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) {}

    async createReservation(data: CreateReservationDto) {
        const lastReservation = await this.prisma.reservation.findFirst({
            where: {},
            orderBy: {
                date: 'desc',
            },
        });

        if(lastReservation){
            const nextReservation = addHours(new Date(lastReservation.date),2);
            const newDate = new Date(data.date);

            if(isBefore(newDate, nextReservation)){
                throw new BadRequestException('Veuillez attendre 2h pour réserver votre prochain film !')
            }
        }
        return this.prisma.reservation.create({
            data,
       })
      }
}

