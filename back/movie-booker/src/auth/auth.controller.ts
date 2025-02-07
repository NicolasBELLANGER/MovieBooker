import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    
        @ApiOperation({ summary: 'Inscription utilisateur' })
        @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
        @Post('register')
        register(@Body() registerDto : RegisterDto){
            return this.authService.createUser(registerDto);
        }

        @ApiOperation({ summary: 'Connexion utilisateur' })
        @ApiResponse({ status: 200, description: 'Connexion réussie et token généré' })
        @Post('login')
        @HttpCode(200)
        login(@Body() loginDto: LoginDto){
            return this.authService.loginUser(loginDto);
        }
}
