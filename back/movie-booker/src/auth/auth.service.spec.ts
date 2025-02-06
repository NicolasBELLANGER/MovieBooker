import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadGatewayException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('test-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should hash password correctly', async () => {
    const password = 'password123';
    const hash = await authService.hashPassword(password);
    expect(await bcrypt.compare(password, hash)).toBeTruthy();
  });

  it('should create a user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstname: 'John',
      lastname: 'Doe',
    };

    prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
    prismaService.user.create = jest.fn().mockResolvedValue(userData);

    const user = await authService.createUser(userData);
    expect(user).toEqual(userData);
  });

  it('should throw error if email already exists', async () => {
    prismaService.user.findUnique = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });

    await expect(authService.createUser({ email: 'test@example.com', password: 'password123' }))
      .rejects
      .toThrow(BadGatewayException);
  });

  it('should validate password correctly', async () => {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    expect(await authService.decryptPassword(password, hash)).toBeTruthy();
  });

  it('should throw UnauthorizedException if login credentials are incorrect', async () => {
    prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

    await expect(authService.loginUser({ email: 'wrong@example.com', password: 'wrongpass' }))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should return a valid JWT token when logging in', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
    };

    prismaService.user.findUnique = jest.fn().mockResolvedValue(user);

    const result = await authService.loginUser({ email: 'test@example.com', password: 'password123' });
    expect(result).toEqual({
      message: 'Vous êtes connecté avec succès',
      token: 'test-token',
    });
  });
});
