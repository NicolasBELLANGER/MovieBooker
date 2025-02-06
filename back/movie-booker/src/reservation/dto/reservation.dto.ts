import { IsString, IsDate, IsOptional,IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
    @ApiProperty({ example:3, description: 'Id of the user' })
    @IsInt()
    userId: number

    @ApiProperty({ example:345, description: 'Id of the movie' })
    @IsInt()
    movieId: number

    @ApiProperty({ example: 'Sonic 4', description: 'Title of the movie' })
    @IsString()
    movieName: string;

    @ApiProperty({ example: '2025-02-05T00:00:00.000Z', description: 'Date' })
    @IsDate()
    @Type(() => Date)
    date: Date;
}

export class UpdateReservationDto {

    @ApiProperty({ example: '2025-02-06T00:00:00.000Z', description: 'Date change' })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    date?: Date;
}
