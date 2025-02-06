import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}
}
