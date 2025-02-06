import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;
  let mockJwtService: JwtService;

  beforeEach(async () => {
    mockJwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ userId: 1 }), // Simule un JWT valide
    } as unknown as JwtService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            getMovieByPage: jest.fn(),
            getMovieByName: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // Fournit un mock de JwtService
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  describe('getMoviesByPage', () => {
    it('should return movies by page', async () => {
      const mockResponse = { results: [{ id: 1, title: 'Test Movie' }] };
      jest.spyOn(movieService, 'getMovieByPage').mockResolvedValue(mockResponse);

      const result = await movieController.getMoviesByPage({ page: 1 });
      expect(result).toEqual(mockResponse);
      expect(movieService.getMovieByPage).toHaveBeenCalledWith(1);
    });

    it('should throw an error if service fails', async () => {
      jest.spyOn(movieService, 'getMovieByPage').mockRejectedValue(new Error('API Error'));

      await expect(movieController.getMoviesByPage({ page: 1 })).rejects.toThrow('API Error');
    });
  });

  describe('getMoviesByName', () => {
    it('should return movies by name', async () => {
      const mockResponse = { results: [{ id: 1, title: 'Test Movie' }] };
      jest.spyOn(movieService, 'getMovieByName').mockResolvedValue(mockResponse);

      const result = await movieController.getMoviesByName({ name: 'Test' });
      expect(result).toEqual(mockResponse);
      expect(movieService.getMovieByName).toHaveBeenCalledWith('Test');
    });

    it('should throw an error if service fails', async () => {
      jest.spyOn(movieService, 'getMovieByName').mockRejectedValue(new Error('API Error'));

      await expect(movieController.getMoviesByName({ name: 'Test' })).rejects.toThrow('API Error');
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
