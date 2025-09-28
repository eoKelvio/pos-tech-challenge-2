import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto, SignInDto } from './dto/auth';
import { AuthService } from './auth.service';

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
}
