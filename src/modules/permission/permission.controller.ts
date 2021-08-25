import { Controller } from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Разрешения')
@Controller('/api/main/')
export class PermissionController {}
