import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from '../../common/auth/auth.module';
import { Role } from '../../common/role/schemas/role.entity';
import { UserRepository } from '../../common/user/user-repository';
import { OperationRepository } from './operation-repository';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';
import { BillRepository } from '../bill/bill-repository';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([UserRepository, OperationRepository, BillRepository, Role])),
		forwardRef(() => AuthModule)
	],
	providers: [OperationService],
	controllers: [OperationController],
	exports: [OperationService]
})
export class OperationModule {}
