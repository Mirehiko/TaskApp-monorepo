import { Injectable } from '@nestjs/common';

@Injectable()
export class FinappService {
  getHello(): string {
    return 'Hello World!';
  }
}
