import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('POS Tech Challenge API')
    .setDescription('API for POS technical challenge')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      operationsSorter: (a, b) => {
        const order = ['post', 'get', 'put', 'delete'];
        const aIndex = order.indexOf(a.get('method').toLowerCase());
        const bIndex = order.indexOf(b.get('method').toLowerCase());

        if (aIndex === bIndex) {
          return a.get('path').localeCompare(b.get('path'));
        }
        return aIndex - bIndex;
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
