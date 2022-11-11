import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from '../../common/auth/auth.module';
import { Role } from '../../common/role/schemas/role.entity';
import { UserRepository } from '../../common/user/user-repository';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryTreeRepository } from './category-repository';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([UserRepository, CategoryTreeRepository, Role])),
    AuthModule
	],
	providers: [CategoryService],
	controllers: [CategoryController],
	exports: [CategoryService]
})
export class CategoryModule {}
