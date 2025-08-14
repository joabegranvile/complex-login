import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { httpLogger } from './core/logger.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './core/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CaslModule } from './casl/casl.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { KnexModule } from 'nestjs-knex';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CaslModule,
    CacheModule.register({ isGlobal: true }),
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: {
          client: 'psql',
          connection: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'root',
            database: 'nest',
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(httpLogger).forRoutes({
      path: 'abcd/*splat',
      method: RequestMethod.ALL,
    });
  }
}
