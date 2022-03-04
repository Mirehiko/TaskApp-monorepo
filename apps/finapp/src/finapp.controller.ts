import { Controller, Get } from '@nestjs/common';
import { FinappService } from './finapp.service';

@Controller()
export class FinappController {
  constructor(private readonly finappService: FinappService) {}

  @Get()
  getHello(): string {
    return this.finappService.getHello();
  }
}
