import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { BaseService } from '../../base-service';
import { BillRepository } from './bill-repository';
import { Bill } from './schemas/bill.entity';
import { BillRequestDto, IBillGetParamsData, IChangeBalance } from '@finapp/app-common';
import { UserRepository } from '../../common/user/user-repository';


@Injectable()
export class BillService extends BaseService<Bill, IBillGetParamsData> {
	protected entityNotFoundMessage: string = 'Нет такого счета';
	protected entityOrRelationNotFoundMessage: string = '';

	constructor(
    protected repository: BillRepository,
    protected userRepository: UserRepository,
	) {
		super();
	}

  /**
   *
   * @param requestDto
   */
	async create(@Param() requestDto: BillRequestDto): Promise<Bill> {
    const user = await this.userRepository.findOne({where: {id: requestDto.userId}});
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const newBill = await this.repository.create({...requestDto});
    newBill.user = user;
    return await this.repository.save(newBill); // 200
	}

  /**
   *
   * @param id
   * @param requestDto
   */
	async update(@Param() id: number, requestDto: BillRequestDto): Promise<Bill> {
    let bill = await this.repository.findOne(id);
    bill.name = requestDto.name ? requestDto.name : bill.name;
    bill.description = requestDto.description ? requestDto.description : bill.description;
    bill.status = requestDto.status ? requestDto.status : bill.status;
    bill.type = requestDto.type ? requestDto.type : bill.type;

    try {
      return await this.repository.save(bill);
    }
    catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param id
   * @param changeBalance
   */
  async changeBalance(@Param() id: number, changeBalance: IChangeBalance): Promise<Bill> {
    return await this.repository.changeBalance(id, changeBalance);
  }
}


