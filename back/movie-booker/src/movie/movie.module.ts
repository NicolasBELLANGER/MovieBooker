import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [JwtModule] 
})
export class MovieModule {}
