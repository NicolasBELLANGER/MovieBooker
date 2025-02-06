import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
    constructor() {}

    async getMovieByPage(page: number){
       const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
       const options = {
        method: 'GET',
        headers: {
           accept: 'application/json',
           Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        }
       };
       return await fetch(url, options)
        .then((res) => res.json())
    }

    async getMovieByName(name: string){
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(name)}&include_adult=false&include_video=false&language=en-US&api_key=b248e55d78a5c1187a2094e4806ef871`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            }
        };
        return await fetch(url, options)
        .then((res) => res.json())
    }
}
