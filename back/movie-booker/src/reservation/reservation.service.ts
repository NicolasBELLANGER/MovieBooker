import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';
import { PrismaService } from '../prisma.service';
import { addHours, isBefore } from 'date-fns';
@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) {}

    async createReservation(data: CreateReservationDto) {
        const lastReservation = await this.prisma.reservation.findFirst({
            where: {
                userId: data.userId,
            },
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
            data
       })
    }

    async getAllReservation(){
        return this.prisma.reservation.findMany();
    }

    async getReservationByUserId(userId : number){
        if(!userId){
            throw new BadRequestException('UserId is required')
        }
        return this.prisma.reservation.findMany({
            where : {
                userId : userId,
            }
        })
    }

    async getReservationById(reservationId : number){
        if(!reservationId){
            throw new BadRequestException('ReservationId is required')
        }
        try{
            const reservation = await this.prisma.reservation.findUnique({
                where : {
                    id: reservationId
                },
            })
            if(!reservation){
                throw new BadRequestException('Not found')
            }
            return reservation
        }
        catch{
            throw new BadRequestException('Impossible to found reservation')
        }
    }
}

