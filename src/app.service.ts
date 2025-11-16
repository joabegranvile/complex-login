import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getInstanceId(): string {
    return process.env.INSTANCE_ID || os.hostname();
  }
}
