import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';
import { CreateReservationDto } from './dto/reservation.dto';

describe('ReservationController', () => {
  let reservationController: ReservationController;
  let reservationService: ReservationService;
  let mockJwtService: JwtService;

  beforeEach(async () => {
    mockJwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ userId: 1 }), // Simule un JWT valide
    } as unknown as JwtService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            createReservation: jest.fn(),
            getAllReservation: jest.fn(),
            getReservationById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // Fournit un mock de JwtService
        },
      ],
    }).compile();

    reservationController = module.get<ReservationController>(ReservationController);
    reservationService = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(reservationController).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      const reservationData: CreateReservationDto = {
        userId: 1,
        movieId: 101,
        movieName: 'Test Movie',
        date: new Date('2025-02-05T00:00:00.000Z'),
      };

      const mockResponse = {
        id: 1,
        ...reservationData,
        createAt: new Date(), // Ajout de createAt
        updatedAt: new Date(), // Ajout de updatedAt
      };

      jest.spyOn(reservationService, 'createReservation').mockResolvedValue(mockResponse);

      const result = await reservationController.createReservation(reservationData);
      expect(result).toEqual(mockResponse);
      expect(reservationService.createReservation).toHaveBeenCalledWith(reservationData);
    });
  });

  describe('getAllReservation', () => {
    it('should return all reservations', async () => {
      const mockReservations = [
        { id: 1, userId: 1, movieId: 101, movieName: 'Movie A', date: new Date(), createAt: new Date(), updatedAt: new Date() },
        { id: 2, userId: 2, movieId: 102, movieName: 'Movie B', date: new Date(), createAt: new Date(), updatedAt: new Date() },
      ];

      jest.spyOn(reservationService, 'getAllReservation').mockResolvedValue(mockReservations);

      const result = await reservationController.getAllReservation();
      expect(result).toEqual(mockReservations);
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation by ID', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        movieId: 101,
        movieName: 'Test Movie',
        date: new Date(),
        createAt: new Date(), // Ajout
        updatedAt: new Date(), // Ajout
      };

      jest.spyOn(reservationService, 'getReservationById').mockResolvedValue(mockReservation);

      const result = await reservationController.getReservationById('1');
      expect(result).toEqual(mockReservation);
      expect(reservationService.getReservationById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if reservation ID is invalid', async () => {
      jest.spyOn(reservationService, 'getReservationById').mockRejectedValue(new Error('Not found'));

      await expect(reservationController.getReservationById('999')).rejects.toThrow('Not found');
    });
  });

  it('should be protected by AuthGuard', async () => {
    const guard = new AuthGuard(mockJwtService);
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer validToken' },
      }),
    } as unknown as ExecutionContext;

    expect(await guard.canActivate(context)).toBe(true);
  });
});
