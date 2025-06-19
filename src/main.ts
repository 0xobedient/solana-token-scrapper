import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { SWAGGER_BASIC_AUTH } from './shared/constants/swagger.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [SWAGGER_BASIC_AUTH.USERNAME]: SWAGGER_BASIC_AUTH.PASSWORD,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('memetus pumpfun api')
    .setDescription('API description')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, customOptions);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
