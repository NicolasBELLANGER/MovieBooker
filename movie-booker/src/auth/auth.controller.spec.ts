import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BadGatewayException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user successfully', async () => {
    const registerDto: RegisterDto = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const createdUser = {
      id: 1,
      ...registerDto,
      password: 'hashedPassword',
    };

    jest.spyOn(authService, 'createUser').mockResolvedValue(createdUser);

    const result = await authController.register(registerDto);

    expect(result).toEqual(createdUser);
    expect(authService.createUser).toHaveBeenCalledWith(registerDto);
  });

  it('should throw error if email already exists', async () => {
    const registerDto: RegisterDto = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    jest.spyOn(authService, 'createUser').mockRejectedValue(new BadGatewayException('Email already exist !'));

    await expect(authController.register(registerDto)).rejects.toThrow(BadGatewayException);
  });

  it('should login a user successfully', async () => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    const loginResponse = {
      message: 'Vous êtes connecté avec succès',
      token: 'test-token',
    };

    jest.spyOn(authService, 'loginUser').mockResolvedValue(loginResponse);

    const result = await authController.login(loginDto);

    expect(result).toEqual(loginResponse);
    expect(authService.loginUser).toHaveBeenCalledWith(loginDto);
  });

  it('should throw error on invalid login credentials', async () => {
    const loginDto: LoginDto = {
      email: 'wrong@example.com',
      password: 'wrongpass',
    };

    jest.spyOn(authService, 'loginUser').mockRejectedValue(new UnauthorizedException('Invalid credentials'));

    await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
  });
});