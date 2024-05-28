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

  //test
  async triggerForTesting() {
    const totalEmployees = await this._employeeService.countEmployees();

    // for the testing, will update 1 employee only
    const TESTING_NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY =
      WalletService.DEFAULT_NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY;
    const totalBatches = Math.ceil(
      totalEmployees / TESTING_NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
    );

    for (let batch = 0; batch < totalBatches; batch++) {
      await this._walletQueue.add({
        batch,
        paging: {
          limit: this.NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
          offset: batch * this.NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
        },
      });
    }

    return 'wallets';
  }

  async getBalance(employeeId: number) {
    return this._employeeWalletRepo.findOne({
      where: { employee: { id: employeeId } },
    });
  }

  async calculateAndUpdateByBatch(batch: number) {
    const currentDate = new Date();
    const daysInMonth = getDaysInMonth(currentDate);

    //transaction
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let employees: EmployeeDetailDto[];
      employees = await this._employeeDao.getEmployeeDetails({
        paging: {
          limit: this.NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
          offset: batch * this.NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
        },
      });

      //will store id array to job payload
      const employeeToStoreJobPayload: number[] = [];

      for (const employee of employees) {
        const employeeMapper: {
          id: number;
          baseSalary: number;
          dayOfWorks: number;
          type: string;
          name: string;
          currentBalance: number;
          employeeWalletId: number;
        } = {
          id: employee.id,
          baseSalary: employee.base_salary,
          dayOfWorks: employee.day_of_works,
          type: employee.type,
          name: employee.name,
          employeeWalletId: employee.employee_wallet_id,
          currentBalance: employee.current_balance,
        };

        // I assume salary will be integer in this assessment
        let dailyRate =
          employee.type === EmployeeTypeEnum.FULL_TIME
            ? Math.floor(employeeMapper.baseSalary / daysInMonth)
            : employeeMapper.baseSalary;
        let salaryWillGet = dailyRate * employeeMapper.dayOfWorks;

        const employeeTypeEntity = new EmployeeType();
        employeeTypeEntity.create({ type: employeeMapper.type });
        const employeeEntity = new Employee();
        employeeEntity.create({
          id: employeeMapper.id,
          employeeType: employeeTypeEntity,
          name: employeeMapper.name,
        });

        let balanceAfter = employeeMapper.currentBalance + salaryWillGet;

        const employeeWallet = new EmployeeWallet();
        employeeWallet.create({
          id: employeeMapper.employeeWalletId,
          balance: balanceAfter,
          employee: employeeEntity,
        });

        //update balance
        await this._employeeWalletRepo.update(
          employeeWallet.id,
          employeeWallet,
        );

        // store log feature to queue to reduce traffic
        await this._walletLogQueue.add({
          employeeWallet,
          amountChanged: salaryWillGet,
          description: 'Update balance for employee wallet',
          newBalance: balanceAfter,
          previousBalance: employeeMapper.currentBalance,
        });

        employeeToStoreJobPayload.push(employee.id);
      }

      await queryRunner.commitTransaction();

      return employeeToStoreJobPayload;
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
