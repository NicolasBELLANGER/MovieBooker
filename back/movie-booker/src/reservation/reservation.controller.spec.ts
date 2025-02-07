import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateReservationDto } from './dto/reservation.dto';

describe('ReservationController (e2e)', () => {
  let app: INestApplication;
  let reservationService: ReservationService;

  beforeEach(async () => {
    const mockAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: {
            reservation: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    reservationService = moduleFixture.get<ReservationService>(ReservationService);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /reservation', () => {
    it('should create a reservation', async () => {
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

      jest.spyOn(reservationService, 'createReservation').mockResolvedValue(createdReservation);

      const response = await request(app.getHttpServer())
        .post('/reservation')
        .send(reservationDto)
        .expect(201);

      expect(response.body).toEqual(expect.objectContaining({
        id: createdReservation.id,
        userId: createdReservation.userId,
        movieId: createdReservation.movieId,
        movieName: createdReservation.movieName,
        date: createdReservation.date.toISOString(),
        createAt: createdReservation.createAt.toISOString(),
        updatedAt: createdReservation.updatedAt.toISOString(),
      }));
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = { movieId: 100 };

      await request(app.getHttpServer()).post('/reservation').send(invalidDto).expect(400);
    });
  });

  describe('GET /reservation', () => {
    it('should return all reservations', async () => {
      const reservations = [
        { id: 1, userId: 1, movieId: 100, movieName: 'Movie 1', date: new Date(), createAt: new Date(), updatedAt: new Date() },
        { id: 2, userId: 2, movieId: 101, movieName: null, date: new Date(), createAt: new Date(), updatedAt: new Date() },
      ];

      jest.spyOn(reservationService, 'getAllReservation').mockResolvedValue(reservations);

      const response = await request(app.getHttpServer()).get('/reservation').expect(200);

      expect(response.body).toEqual(
        reservations.map((reservation) => ({
          ...reservation,
          date: reservation.date.toISOString(),
          createAt: reservation.createAt.toISOString(),
          updatedAt: reservation.updatedAt.toISOString(),
        }))
      );
    });
  });

  describe('GET /reservation/:id', () => {
    it('should return a reservation by ID', async () => {
      const reservation = { id: 1, userId: 1, movieId: 100, movieName: 'Movie 1', date: new Date(), createAt: new Date(), updatedAt: new Date() };

      jest.spyOn(reservationService, 'getReservationById').mockResolvedValue(reservation);

      const response = await request(app.getHttpServer()).get('/reservation/1').expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        id: reservation.id,
        userId: reservation.userId,
        movieId: reservation.movieId,
        movieName: reservation.movieName,
        date: reservation.date.toISOString(),
        createAt: reservation.createAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
      }));
    });

    it('should return 400 for invalid ID', async () => {
      await request(app.getHttpServer()).get('/reservation/invalid').expect(400);
    });

    it('should return 404 if reservation not found', async () => {
      jest.spyOn(reservationService, 'getReservationById').mockRejectedValue(new NotFoundException('Reservation not found'));

      await request(app.getHttpServer()).get('/reservation/999').expect(404);
    });
  });
});
