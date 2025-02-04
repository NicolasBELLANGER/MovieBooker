import { Controller, Get, Query, Param } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
    constructor(private readonly moviesService: MovieService) {}
    
    @Get()
    async getMoviesByPage(@Query() params: { page: number }) {
        return this.moviesService.getMovieByPage(params.page);
    }
    @Get('search')
    async getMoviesByName(@Query() params: {name: string}){
        return this.moviesService.getMovieByName(params.name);
    }
}
