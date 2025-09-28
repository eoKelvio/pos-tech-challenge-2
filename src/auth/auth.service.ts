import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth';

@Injectable()
export class AuthService {
  async signup(data: SignUpDto) {
    console.log(data);
    return data;
  }

  async signin(data: SignInDto) {
    console.log(data);
    return data;
  }
}
