import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from '../../common/auth/auth.module';
import { UserRepository } from '../../common/user/user-repository';
import { CategoryRepository } from './category-repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([UserRepository, CategoryRepository])),
		forwardRef(() => AuthModule)
	],
	providers: [CategoryService],
	controllers: [CategoryController],
	exports: [CategoryService]
})
export class CategoryModule {}
