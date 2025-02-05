import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { AuthGuard } from 'src/auth/auth.gard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('movie')
export class MovieController {
    constructor(private readonly moviesService: MovieService) {}
    
    @UseGuards(AuthGuard)
    @Get()
    @ApiBearerAuth()
    async getMoviesByPage(@Query() params: { page: number }) {
        return this.moviesService.getMovieByPage(params.page);
    }

    @UseGuards(AuthGuard)
    @Get('search')
    @ApiBearerAuth()
    async getMoviesByName(@Query() params: {name: string}){
        return this.moviesService.getMovieByName(params.name);
    }
}
