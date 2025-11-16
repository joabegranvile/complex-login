import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './core/decorators/ispublic';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('instance')
  @IsPublic()
  getInstance(): string {
    return this.appService.getInstanceId();
  }
}
