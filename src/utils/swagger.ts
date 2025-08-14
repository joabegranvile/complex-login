import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Constants } from 'src/core/constants/constanst';

export class SwaggerUtils {
  static setupSwagger(app: NestExpressApplication) {
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .addBearerAuth()
      .addServer(Constants.SERVER_URL)
      .setDescription('The NestJS API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
