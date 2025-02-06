import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async hashPassword(password:string){
      const hashPassword = await bcrypt.hash(password, 10);
      return hashPassword;
    }

    async createUser(data: Prisma.UserCreateInput) {
      const existingUser = await this.prisma.user.findUnique({ where: {email: data.email}});
      if(existingUser){
        throw new BadGatewayException('Email already exist !');
      }
      if(data.password){
        data.password = await this.hashPassword(data.password);
      }
      return this.prisma.user.create({
        data,
      })
    }

    async decryptPassword(password: string, hashPassword: string){
      const decryptPassword = await bcrypt.compare(password, hashPassword);
      return decryptPassword;
    }

    async loginUser(data:{email: string, password: string}): Promise<{message: string, token: string}>{
      const user = await this.prisma.user.findUnique({ where: {email: data.email}});
      if (!user || !user.password){
        throw new UnauthorizedException('Invalid credentials');
      }
      const decryptPassword = await this.decryptPassword(data.password, user.password);
      if(!decryptPassword){
        throw new UnauthorizedException('Invalid credentials');
      }
      const playload = {userId: user.id, email: user.email };
      return {
        message: 'Vous êtes connecté avec succès',
        token: await this.jwtService.signAsync(playload),
      };
    }
}
