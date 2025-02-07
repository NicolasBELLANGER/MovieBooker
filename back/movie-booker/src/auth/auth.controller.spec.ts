import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            loginUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      const createdUser = {
        id: 1,
        ...registerDto,
        password: null, // Correction : Prisma attend "null" et non "undefined"
      };

      jest.spyOn(authService, 'createUser').mockResolvedValue(createdUser);

      const response = await request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(201);

      expect(response.body).toEqual(expect.objectContaining({
        id: createdUser.id,
        firstname: createdUser.firstname,
        lastname: createdUser.lastname,
        email: createdUser.email,
      }));
    });

    it('should return 400 if registration data is invalid', async () => {
      const invalidDto = { email: 'invalid-email' };

      await request(app.getHttpServer()).post('/auth/register').send(invalidDto).expect(400);
    });

    it('should return 400 if email already exists', async () => {
      jest.spyOn(authService, 'createUser').mockRejectedValue(new BadRequestException('Email already exists'));

      const registerDto: RegisterDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(400);
      expect(response.body.message).toBe('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should log in a user and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      const loginResponse = {
        message: 'Vous êtes connecté avec succès',
        token: 'mocked-jwt-token',
      };

      jest.spyOn(authService, 'loginUser').mockResolvedValue(loginResponse);

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginDto).expect(200);

      expect(response.body).toEqual(loginResponse);
    });

    it('should return 400 if login data is invalid', async () => {
      const invalidDto = { email: 'invalid-email' };

      await request(app.getHttpServer()).post('/auth/login').send(invalidDto).expect(400);
    });

    it('should return 401 if credentials are incorrect', async () => {
      jest.spyOn(authService, 'loginUser').mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginDto).expect(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
