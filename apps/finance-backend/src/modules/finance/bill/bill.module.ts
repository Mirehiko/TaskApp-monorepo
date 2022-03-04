import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from '../../common/auth/auth.module';
import { Role } from '../../common/role/schemas/role.entity';
import { UserRepository } from '../../common/user/user-repository';
import { OperationRepository } from '../operation/operation-repository';
import { BillRepository } from './bill-repository';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([UserRepository, BillRepository, Role])),
		forwardRef(() => AuthModule)
	],
	providers: [BillService],
	controllers: [BillController],
	exports: [BillService]
})
export class BillModule {}
