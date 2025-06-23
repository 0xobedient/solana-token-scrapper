import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import mongodbConfig from './shared/configs/mongodb.config';
import onchainConfig from './shared/configs/onchain.config';
import swaggerConfig from './shared/configs/swagger.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TokenGateway } from './token/token.gateway';
import { TokenModule } from './token/token.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: [mongodbConfig, onchainConfig, swaggerConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB.MONGODB_URI'),
        user: configService.get<string>('MONGODB.MONGODB_USERNAME'),
        pass: configService.get<string>('MONGODB.MONGODB_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TokenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    TokenGateway,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
