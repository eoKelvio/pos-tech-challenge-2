import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: '🔓 Health check endpoint',
    description:
      'Returns the health status of the application and system information.',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
          description: 'Health status of the application',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T12:00:00.000Z',
          description: 'Current server timestamp',
        },
        uptime: {
          type: 'number',
          example: 3600.5,
          description: 'Application uptime in seconds',
        },
      },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
