import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInDto, SignUpDto } from './dto/auth';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(data: SignUpDto) {
    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExists) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: passwordHash,
      },
    });

    return { id: user.id, name: user.name, email: user.email };
  }

  async signin(data: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return { accessToken };
  }
}
