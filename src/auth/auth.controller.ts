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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: '🔓 Register new user',
    description: 'Creates a new user account.',
  })
  @ApiResponse({
    status: 201,
    description: '✅ User created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '⚠️ Invalid data - Check your input',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'Email must be a valid email',
            'Password must be at least 6 characters',
          ],
        },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  @ApiOperation({
    summary: '🔓 User login',
    description: 'Authenticates user and returns JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔒 Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid credentials' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '🔒 Get current user data',
    description: "Returns the authenticated user's information.",
  })
  @ApiResponse({
    status: 200,
    description: '✅ User data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        iat: { type: 'number', example: 1640995200 },
        exp: { type: 'number', example: 1640998800 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔒 Unauthorized - Authentication required',
  })
  async me(@Request() request) {
    return request.user;
  }
}
