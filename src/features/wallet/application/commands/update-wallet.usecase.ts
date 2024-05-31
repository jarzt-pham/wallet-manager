import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmployeeType } from '../../../employee/domain/entities/employee-type.entity';
import { Employee } from '../../../employee/domain/entities/employee.entity';
import {
  EmployeeDao,
  EmployeeDetailDto,
} from '../../../employee/infrastructure/daos/employee.dao';
import { EmployeeWallet } from '../../domain/entities/employee-wallet.entity';
import { WalletService } from '../../infrastructure/services/wallet.service';

type UpdateWalletUsecaseInput = EmployeeDetailDto;

@Injectable()
export class UpdateWalletUsecase {
  private _logger: Logger;
  constructor(
    private readonly _employeeDao: EmployeeDao,
    private _walletService: WalletService,
  ) {
    this._logger = new Logger(UpdateWalletUsecase.name);
  }

  async execute(payload: UpdateWalletUsecaseInput) {
    const employeeMapper: {
      id: number;
      baseSalary: number;
      dayOfWorks: number;
      type: string;
      name: string;
      currentBalance: number;
      employeeWalletId: number;
    } = {
      id: payload.id,
      baseSalary: payload.base_salary,
      dayOfWorks: payload.day_of_works,
      type: payload.type,
      name: payload.name,
      employeeWalletId: payload.employee_wallet_id,
      currentBalance: payload.current_balance,
    };

    const { salaryWillGet, balanceAfter } = this._walletService.calculateSalary(
      {
        baseSalary: employeeMapper.baseSalary,
        dayOfWorks: employeeMapper.dayOfWorks,
        type: employeeMapper.type,
        currentBalance: employeeMapper.currentBalance,
      },
    );

    const employeeTypeEntity = new EmployeeType();
    employeeTypeEntity.create({ type: employeeMapper.type });
    const employeeEntity = new Employee();
    employeeEntity.create({
      id: employeeMapper.id,
      employeeType: employeeTypeEntity,
      name: employeeMapper.name,
    });

    const employeeWallet = new EmployeeWallet();
    employeeWallet.create({
      id: employeeMapper.employeeWalletId,
      balance: balanceAfter,
      employee: employeeEntity,
    });

    try {
      await this._walletService.updateWallet({
        employeeWallet,
        balanceAfter,
        salaryWillGet,
        employee: employeeMapper,
      });

      employeeMapper.currentBalance = balanceAfter;
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    return employeeMapper;
  }
}
