import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('movie')
export class MovieController {
    constructor(private readonly moviesService: MovieService) {}
    
    @UseGuards(AuthGuard)
    @Get()
    @ApiBearerAuth()
    @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
    async getMoviesByPage(@Query() params: { page: number }) {
        return this.moviesService.getMovieByPage(params.page);
    }

    @UseGuards(AuthGuard)
    @Get('search')
    @ApiBearerAuth()
    @ApiQuery({ name: 'name', type: String, required: true, example: 'Inception' })
    async getMoviesByName(@Query() params: {name: string}){
        return this.moviesService.getMovieByName(params.name);
    }
}
