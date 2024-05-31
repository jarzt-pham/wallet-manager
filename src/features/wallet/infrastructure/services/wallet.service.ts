import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeSalary } from 'src/features/employee/domain/entities/employee-salary.entity';
import { EmployeeType } from 'src/features/employee/domain/entities/employee-type.entity';
import { Employee } from 'src/features/employee/domain/entities/employee.entity';
import { DataSource, Repository } from 'typeorm';
import { EmployeeWallet } from '../../domain/entities/employee-wallet.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JOB_QUEUE } from 'src/features/job/queue';
import {
  EMPLOYEE_ATTENDANCE_TABLE,
  EMPLOYEE_TYPE_TABLE,
  EmployeeService,
} from 'src/features/employee/infrastructure';
import {
  EmployeeDao,
  EmployeeDetailDto,
} from 'src/features/employee/infrastructure/daos/employee.dao';
import { ConfigService } from '@nestjs/config';
import { EmployeeTypeEnum } from 'src/features/employee/domain/entities/types';
import { getDaysInMonth } from 'src/utils';

@Injectable()
export class WalletService {
  private readonly _logger: Logger;

  NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY: number;
  static DEFAULT_NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY = 1;

  constructor(
    private _configService: ConfigService,
    private readonly _dataSource: DataSource,

    private readonly _employeeService: EmployeeService,
    private readonly _employeeDao: EmployeeDao,

    @InjectRepository(EmployeeWallet)
    private _employeeWalletRepo: Repository<EmployeeWallet>,

    @InjectQueue(JOB_QUEUE.WALLET) private _walletQueue: Queue,
    @InjectQueue(JOB_QUEUE.WALLET_LOG) private _walletLogQueue: Queue,
  ) {
    this._logger = new Logger(WalletService.name);

    this.NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY =
      this._configService.get('NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY') ??
      WalletService.DEFAULT_NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY;
  }

  calculateBatch({
    totalEmployees,
    employeePerUpdating,
  }: {
    totalEmployees: number;
    employeePerUpdating: number;
  }) {
    return Math.ceil(totalEmployees / employeePerUpdating);
  }

  //test
  async triggerForTesting() {
    const BATCH = 1;
    await this._walletQueue.add({
      batch: BATCH,
      paging: {
        limit: WalletService.DEFAULT_NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
        offset:
          BATCH * WalletService.DEFAULT_NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
      },
    });

    return 'trigger';
  }

  async getBalance(employeeId: number) {
    return this._employeeWalletRepo.findOne({
      where: { employee: { id: employeeId } },
    });
  }

  calculateSalary(employee: {
    baseSalary: number;
    dayOfWorks: number;
    type: string;
    currentBalance: number;
  }) {
    const currentDate = new Date();
    const daysInMonth = getDaysInMonth(currentDate);

    // I assume salary will be integer in this assessment
    let dailyRate =
      employee.type === EmployeeTypeEnum.FULL_TIME
        ? Math.floor(employee.baseSalary / daysInMonth)
        : employee.baseSalary;

    let salaryWillGet = dailyRate * employee.dayOfWorks;
    let balanceAfter = employee.currentBalance + salaryWillGet;

    return {
      dailyRate,
      salaryWillGet,
      balanceAfter,
    };
  }

  async updateWallet({
    employeeWallet,
    salaryWillGet,
    balanceAfter,
    employee,
  }: {
    employeeWallet: EmployeeWallet;
    salaryWillGet: number;
    balanceAfter: number;
    employee: {
      id: number;
      baseSalary: number;
      dayOfWorks: number;
      type: string;
      name: string;
      currentBalance: number;
      employeeWalletId: number;
    };
  }) {
    //transaction
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //update balance
      await this._employeeWalletRepo.update(employeeWallet.id, employeeWallet);

      // store log feature to queue to reduce traffic
      await this._walletLogQueue.add({
        employeeWallet,
        amountChanged: salaryWillGet,
        description: 'Update balance for employee wallet',
        newBalance: balanceAfter,
        previousBalance: employee.currentBalance,
      });

      await queryRunner.commitTransaction();

      return employeeWallet;
    } catch (err) {
      console.error({ err });
      this._logger.error(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
