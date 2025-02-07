import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { CreateReservationDto } from './dto/reservation.dto';
import { BadRequestException } from '@nestjs/common';
import { addHours } from 'date-fns';

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    reservationService = module.get<ReservationService>(ReservationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(reservationService).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a new reservation if no previous reservation exists', async () => {
      const reservationDto: CreateReservationDto = {
        userId: 1,
        movieId: 100,
        movieName: 'Movie Title',
        date: new Date('2025-02-05T00:00:00.000Z'),
      };

      const createdReservation = {
        id: 1,
        ...reservationDto,
        createAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.reservation, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.reservation, 'create').mockResolvedValue(createdReservation);

      const result = await reservationService.createReservation(reservationDto);
      expect(result).toEqual(createdReservation);
      expect(prismaService.reservation.create).toHaveBeenCalledWith({ data: reservationDto });
    });

    it('should throw an error if the user tries to book within 2 hours of last reservation', async () => {
      const lastReservation = {
        id: 1,
        userId: 1,
        movieId: 100,
        movieName: 'Old Movie',
        date: new Date(),
        createAt: new Date(),
        updatedAt: new Date(),
      };

      const newReservation: CreateReservationDto = {
        userId: 1,
        movieId: 101,
        movieName: 'New Movie',
        date: addHours(new Date(), 1), // Tentative de réservation dans 1 heure
      };

      jest.spyOn(prismaService.reservation, 'findFirst').mockResolvedValue(lastReservation);

      await expect(reservationService.createReservation(newReservation)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAllReservation', () => {
    it('should return all reservations', async () => {
      const reservations = [
        { id: 1, userId: 1, movieId: 100, movieName: 'Movie 1', date: new Date(), createAt: new Date(), updatedAt: new Date() },
        { id: 2, userId: 2, movieId: 101, movieName: 'Movie 2', date: new Date(), createAt: new Date(), updatedAt: new Date() },
      ];

      jest.spyOn(prismaService.reservation, 'findMany').mockResolvedValue(reservations);

      const result = await reservationService.getAllReservation();
      expect(result).toEqual(reservations);
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation by ID', async () => {
      const reservation = { 
        id: 1, 
        userId: 1, 
        movieId: 100, 
        movieName: 'Movie 1', 
        date: new Date(), 
        createAt: new Date(), 
        updatedAt: new Date() 
      };

      jest.spyOn(prismaService.reservation, 'findUnique').mockResolvedValue(reservation);

      const result = await reservationService.getReservationById(1);
      expect(result).toEqual(reservation);
    });

    it('should throw BadRequestException if reservationId is missing', async () => {
      await expect(reservationService.getReservationById(NaN)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reservation not found', async () => {
      jest.spyOn(prismaService.reservation, 'findUnique').mockResolvedValue(null);

      await expect(reservationService.getReservationById(999)).rejects.toThrow(BadRequestException);
    });
  });
});
