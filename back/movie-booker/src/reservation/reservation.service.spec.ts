import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createReservation', () => {
    it('should create a new reservation', async () => {
      const newReservation = {
        id: 1,
        userId: 1,
        movieId: 100,
        movieName: 'Test Movie',
        date: new Date(),
        createAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.reservation, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.reservation, 'create').mockResolvedValue(newReservation);

      const result = await service.createReservation(newReservation);
      expect(result).toEqual(newReservation);
    });

    it('should throw an error if the user has to wait 2 hours before reserving again', async () => {
      const lastReservation = {
        id: 2,
        userId: 1,
        movieId: 99,
        movieName: 'Previous Movie',
        date: new Date(),
        createAt: new Date(),
        updatedAt: new Date(),
      };

      const newReservation = {
        id: 3,
        userId: 1,
        movieId: 100,
        movieName: 'Test Movie',
        date: new Date(),
        createAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.reservation, 'findFirst').mockResolvedValue(lastReservation);

      await expect(service.createReservation(newReservation)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAllReservation', () => {
    it('should return all reservations', async () => {
      const mockReservations = [
        {
          id: 1,
          userId: 1,
          movieId: 100,
          movieName: 'Movie A',
          date: new Date(),
          createAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          userId: 2,
          movieId: 101,
          movieName: null,
          date: new Date(),
          createAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.reservation, 'findMany').mockResolvedValue(mockReservations);

      const result = await service.getAllReservation();
      expect(result).toEqual(mockReservations);
    });
  });

  describe('getReservationByUserId', () => {
    it('should return reservations for a user', async () => {
      const mockReservations = [
        {
          id: 1,
          userId: 1,
          movieId: 100,
          movieName: 'Movie A',
          date: new Date(),
          createAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.reservation, 'findMany').mockResolvedValue(mockReservations);

      const result = await service.getReservationByUserId(1);
      expect(result).toEqual(mockReservations);
    });

    it('should throw an error if userId is not provided', async () => {
      await expect(service.getReservationByUserId(NaN)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation by ID', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        movieId: 100,
        movieName: 'Movie A',
        date: new Date(),
        createAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(mockReservation);

      const result = await service.getReservationById(1);
      expect(result).toEqual(mockReservation);
    });

    it('should throw an error if reservationId is not provided', async () => {
      await expect(service.getReservationById(NaN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if reservation is not found', async () => {
      jest.spyOn(prisma.reservation, 'findUnique').mockResolvedValue(null);

      await expect(service.getReservationById(999)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
