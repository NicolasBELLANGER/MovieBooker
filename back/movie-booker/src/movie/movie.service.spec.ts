import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieResultDTO } from './dto/movie.dto';

global.fetch = jest.fn();

describe('MovieService', () => {
  let movieService: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieService],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
  });

  describe('getMovieByPage', () => {
    it('should return a list of movies for a given page', async () => {
      const mockResponse = { results: [{ id: 1, title: 'Movie 1' }] };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await movieService.getMovieByPage(1);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object),
      );
    });
  });

  describe('getMovieByName', () => {
    it('should return a list of movies matching a name', async () => {
      const mockResponse = { results: [{ id: 2, title: 'Movie 2' }] };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await movieService.getMovieByName('Movie 2');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=Movie%202'),
        expect.any(Object),
      );
    });
  });

  describe('getMovieById', () => {
    it('should return details of a movie by ID', async () => {
      const mockResponse: MovieResultDTO = {
        id: 3,
        title: 'Movie 3',
        adult: false,
        backdrop_path: '/path.png',
        original_language: 'en-US',
        original_title: 'Movie 3',
        overview: 'The movie is about something.',
        poster_path: '/poster.png',
        media_type: 'movie',
        genre_ids: [1, 2, 3],
        popularity: 123.45,
        release_date: new Date('2025-02-04T00:00:00.000Z'),
        video: false,
        vote_average: 8.5,
        vote_count: 1500,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await movieService.getMovieById(3);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/3?language=en-US'),
        expect.any(Object),
      );
    });
  });
});
