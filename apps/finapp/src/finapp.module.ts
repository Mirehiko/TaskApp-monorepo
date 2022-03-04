import { Module } from '@nestjs/common';
import { FinappController } from './finapp.controller';
import { FinappService } from './finapp.service';

@Module({
  imports: [],
  controllers: [FinappController],
  providers: [FinappService],
})
export class FinappModule {}
