import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from '../../common/auth/auth.module';
import { UserRepository } from '../../common/user/user-repository';
import { BillRepository } from './bill-repository';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';


@Module({
	imports: [
		// DatabaseModule,
		TypeOrmModule.forFeature(([UserRepository, BillRepository])),
		forwardRef(() => AuthModule)
	],
	providers: [BillService],
	controllers: [BillController],
	exports: [BillService]
})
export class BillModule {}
