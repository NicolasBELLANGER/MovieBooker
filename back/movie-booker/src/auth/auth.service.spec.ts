import { BadGatewayException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should return a hashed password', async () => {
      const password = 'password123';
      const hashedPassword = await authService.hashPassword(password);
      expect(hashedPassword).not.toEqual(password);
      expect(await bcrypt.compare(password, hashedPassword)).toBe(true);
    });
  });

  describe('createUser', () => {
    it('should create a new user when email does not exist', async () => {
      const registerDto: RegisterDto = {
        firstname: 'Nicolas',
        lastname: 'Dupont',
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: 1,
        ...registerDto,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      const result = await authService.createUser(registerDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw BadGatewayException if email already exists', async () => {
      const registerDto: RegisterDto = {
        firstname: 'Nicolas',
        lastname: 'Dupont',
        email: 'test@example.com',
        password: 'password123',
      };

      const existingUser = {
        id: 1,
        ...registerDto,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(existingUser);

      await expect(authService.createUser(registerDto)).rejects.toThrow(BadGatewayException);
    });
  });

  describe('decryptPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      expect(await authService.decryptPassword(password, hashedPassword)).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash('wrongpassword', 10);
      expect(await authService.decryptPassword(password, hashedPassword)).toBe(false);
    });
  });

  describe('loginUser', () => {
    it('should return a token when credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: loginDto.email,
        firstname: 'Nicolas',
        lastname: 'Dupont',
        password: await bcrypt.hash(loginDto.password, 10),
      };

      const token = 'mocked-jwt-token';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(authService, 'decryptPassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await authService.loginUser(loginDto);

      expect(result).toEqual({ message: 'Vous êtes connecté avec succès', token });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(authService.loginUser(loginDto))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 1,
        email: loginDto.email,
        firstname: 'Nicolas',
        lastname: 'Dupont',
        password: await bcrypt.hash('password123', 10),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(authService, 'decryptPassword').mockResolvedValue(false);

      await expect(authService.loginUser(loginDto))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
