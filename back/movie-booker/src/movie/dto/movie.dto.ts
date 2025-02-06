import { IsBoolean, IsInt, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieResultDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({description: 'Adult status of the movie', example: false,})
  adult: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Backdrop path of the movie', example: '/path.png',})
  backdrop_path: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({description: 'Id of the movie', example: 1,})
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Title of the movie', example: 'The Movie',})
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Original language of the movie',example: 'en-US',})
  original_language: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Original title of the movie', example: 'The Movie',})
  original_title: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Overview of the movie', example: 'The movie is about',})
  overview: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Poster path of the movie',example: '/path.png',})
  poster_path: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Media type of the movie',example: 'movie',})
  media_type: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({description: 'Genre ids of the movie',example: [1, 2, 1],})
  genre_ids: number[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({description: 'Media type of the movie',example: 123.45,})
  popularity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Release date of the movie', example: '2025-02-04T00:00:00.000Z',})
  release_date: Date;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({description: 'Video of the movie',example: true,})
  video: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({description: 'Average vote of the movie', example: 1500,})
  vote_average: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({description: 'Vote count of the movie',example: 1500,})
  vote_count: number;
}