import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module({controllers:[AuthController], providers: [AuthService, PrismaService], imports:[ JwtModule.register({global:true, secret: jwtConstants.secret, signOptions: {expiresIn: '1d'},}),]})
export class AuthModule {

}
