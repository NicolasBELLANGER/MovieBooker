/*import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { AuthGuard } from '../auth/auth.guard';

describe('MovieController (e2e)', () => {
  let app: INestApplication;
  let movieService: MovieService;

  beforeEach(async () => {
    const mockAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            getMovieByPage: jest.fn(),
            getMovieByName: jest.fn(),
            getMovieById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    movieService = moduleFixture.get<MovieService>(MovieService);
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /movie', () => {
    it('should return a list of movies for a given page', async () => {
      const mockMovies = { results: [{ id: 1, title: 'Movie 1' }] };
      jest.spyOn(movieService, 'getMovieByPage').mockResolvedValue(mockMovies);

      const response = await request(app.getHttpServer()).get('/movie?page=1').expect(200);

      expect(response.body).toEqual(mockMovies);
    });

    it('should return a default page if page param is missing', async () => {
      const mockMovies = { results: [{ id: 1, title: 'Movie 1' }] };
      jest.spyOn(movieService, 'getMovieByPage').mockResolvedValue(mockMovies);

      const response = await request(app.getHttpServer()).get('/movie').expect(200);

      expect(response.body).toEqual(mockMovies);
    });
  });

  describe('GET /movie/search', () => {
    it('should return movies matching a name', async () => {
      const mockMovies = { results: [{ id: 2, title: 'Inception' }] };
      jest.spyOn(movieService, 'getMovieByName').mockResolvedValue(mockMovies);

      const response = await request(app.getHttpServer()).get('/movie/search?name=Inception').expect(200);

      expect(response.body).toEqual(mockMovies);
    });

    it('should return 400 if name param is missing', async () => {
      const response = await request(app.getHttpServer()).get('/movie/search').expect(400);
      expect(response.body.message).toBe('The "name" query parameter is required.');
    });
  });

  describe('GET /movie/:id', () => {
    it('should return movie details by ID', async () => {
      const mockMovie = { id: 3, title: 'Avatar' };
      jest.spyOn(movieService, 'getMovieById').mockResolvedValue(mockMovie);

      const response = await request(app.getHttpServer()).get('/movie/3').expect(200);

      expect(response.body).toEqual(mockMovie);
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app.getHttpServer()).get('/movie/invalid').expect(400);
      expect(response.body.message).toBe('Invalid movie ID.');
    });

    it('should return 404 if movie not found', async () => {
      jest.spyOn(movieService, 'getMovieById').mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get('/movie/999').expect(404);
      expect(response.body.message).toBe('Movie with ID 999 not found.');
    });
  });
});
*/