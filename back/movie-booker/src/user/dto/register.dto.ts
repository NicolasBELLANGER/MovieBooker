import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto{
    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}