import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';


@ApiTags('Теги')
@Controller('/api/main/')
export class TagController {
  constructor(private readonly service: TagService) {
  }
}
