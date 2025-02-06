import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';
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
    it('should create a reservation successfully', async () => {
      const reservationData: CreateReservationDto = {
        userId: 1,
        movieId: 101,
        movieName: 'Test Movie',
        date: new Date('2025-02-05T00:00:00.000Z'),
      };

      prismaService.reservation.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.reservation.create = jest.fn().mockResolvedValue(reservationData);

      const result = await reservationService.createReservation(reservationData);
      expect(result).toEqual(reservationData);
      expect(prismaService.reservation.create).toHaveBeenCalledWith({ data: reservationData });
    });

    it('should throw an error if reservation is made within 2 hours of last reservation', async () => {
      const lastReservationDate = new Date();
      const nextAvailableDate = addHours(lastReservationDate, 2);

      const reservationData: CreateReservationDto = {
        userId: 1,
        movieId: 101,
        movieName: 'Test Movie',
        date: new Date(),
      };

      prismaService.reservation.findFirst = jest.fn().mockResolvedValue({ date: lastReservationDate });

      await expect(reservationService.createReservation(reservationData))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllReservation', () => {
    it('should return all reservations', async () => {
      const mockReservations = [
        { id: 1, userId: 1, movieId: 101, movieName: 'Movie A', date: new Date() },
        { id: 2, userId: 2, movieId: 102, movieName: 'Movie B', date: new Date() },
      ];

      prismaService.reservation.findMany = jest.fn().mockResolvedValue(mockReservations);

      const result = await reservationService.getAllReservation();
      expect(result).toEqual(mockReservations);
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation by ID', async () => {
      const mockReservation = { id: 1, userId: 1, movieId: 101, movieName: 'Test Movie', date: new Date() };

      prismaService.reservation.findUnique = jest.fn().mockResolvedValue(mockReservation);

      const result = await reservationService.getReservationById(1);
      expect(result).toEqual(mockReservation);
    });

    it('should throw an error if reservation ID is missing', async () => {
      await expect(reservationService.getReservationById(NaN)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if reservation is not found', async () => {
      prismaService.reservation.findUnique = jest.fn().mockResolvedValue(null);

      await expect(reservationService.getReservationById(999)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if database query fails', async () => {
      prismaService.reservation.findUnique = jest.fn().mockRejectedValue(new Error('DB Error'));

      await expect(reservationService.getReservationById(1)).rejects.toThrow(BadRequestException);
    });
  });
});
