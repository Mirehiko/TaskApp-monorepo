import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListService } from './list.service';


@ApiTags('Папки')
@Controller('/api/main/')
export class ListController {
  constructor(private readonly service: ListService) {
  }
}
