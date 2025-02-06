import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'nicolas@example.com', description: 'Email utilisateur' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Password utilisateur' })
    @IsString()
    @IsNotEmpty()
    password: string;
}