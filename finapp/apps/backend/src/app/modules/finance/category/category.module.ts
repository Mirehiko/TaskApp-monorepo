import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from '../../common/auth/auth.module';
import { Role } from '../../common/role/schemas/role.entity';
import { UserRepository } from '../../common/user/user-repository';
import { OperationRepository } from '../operation/operation-repository';
import { CategoryRepository } from './category-repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([UserRepository, CategoryRepository, Role])),
		forwardRef(() => AuthModule)
	],
	providers: [CategoryService],
	controllers: [CategoryController],
	exports: [CategoryService]
})
export class CategoryModule {}
