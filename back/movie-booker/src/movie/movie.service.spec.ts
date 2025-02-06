import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';

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

  it('should fetch movies by page successfully', async () => {
    const mockResponse = { results: [{ id: 1, title: 'Test Movie' }] };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await movieService.getMovieByPage(1);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=1'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should fetch movies by name successfully', async () => {
    const mockResponse = { results: [{ id: 1, title: 'Test Movie' }] };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await movieService.getMovieByName('Test');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('query=Test'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));

    await expect(movieService.getMovieByPage(1)).rejects.toThrow('Fetch error');
    await expect(movieService.getMovieByName('Test')).rejects.toThrow('Fetch error');
  });
});