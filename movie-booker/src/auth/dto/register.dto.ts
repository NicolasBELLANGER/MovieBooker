import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto{
    @ApiProperty({ example: 'Nicolas', description: 'Prénom utilisateur' })
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({ example: 'Nicolas', description: 'Nom de famille utilisateur' })
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({ example: 'nicolas@example.com', description: 'Email utilisateur' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Password utilisateur' })
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}