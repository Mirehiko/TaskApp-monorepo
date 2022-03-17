import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from '../../common/auth/auth.module';
import { Role } from '../../common/role/schemas/role.entity';
import { UserRepository } from '../../common/user/user-repository';
import { BillRepository } from './bill-repository';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { User } from '../../common/user/schemas/user.entity';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([BillRepository, Role, UserRepository])),
		forwardRef(() => AuthModule)
	],
	providers: [BillService],
	controllers: [BillController],
	exports: [BillService]
})
export class BillModule {}
