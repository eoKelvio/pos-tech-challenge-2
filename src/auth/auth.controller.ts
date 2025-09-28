import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  async signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() request) {
    return request.user;
  }
}
