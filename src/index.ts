import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { httpLogger } from './core/logger.middleware';
import { AllExceptionsFilter } from './core/all-exceptions.filter';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import sourceMapSupport from 'source-map-support';
import cookieParser from 'cookie-parser';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { SwaggerUtils } from './utils/swagger';
sourceMapSupport.install();

const server: Express = express();

async function bootstrap(expressInstance: Express) {
  const adapter = new ExpressAdapter(expressInstance);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter, {
    logger: new ConsoleLogger({
      logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
    }),
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
      forbidUnknownValues: false,
    }),
  );
  app.use(httpLogger);
  SwaggerUtils.setupSwagger(app);

  return app.init();
}
const serverStart = bootstrap(server);

server.use(async (_req, _res, next) => {
  await serverStart;
  next();
});

export { server as main };
