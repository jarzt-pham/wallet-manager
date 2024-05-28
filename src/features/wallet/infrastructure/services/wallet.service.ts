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
  private USER_AMOUNT_UPDATE: number;

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

    this.USER_AMOUNT_UPDATE =
      this._configService.get('USER_AMOUNT_UPDATE') ?? 1;
  }

  //test
  async triggerForTesting() {
    const totalEmployees = await this._employeeService.countEmployees();
    const USER_AMOUNT_UPDATE = 1;
    const totalBatches = Math.ceil(totalEmployees / USER_AMOUNT_UPDATE);

    for (let batch = 0; batch < totalBatches; batch++) {
      await this._walletQueue.add({
        batch,
        paging: {
          limit: this.USER_AMOUNT_UPDATE,
          offset: batch * this.USER_AMOUNT_UPDATE,
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

  async calculateAndUpdateBatch(batch: number) {
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
          limit: this.USER_AMOUNT_UPDATE,
          offset: batch * this.USER_AMOUNT_UPDATE,
        },
      });

      //will store below id array to job payload
      const employeeToStoreJobPayload: number[] = [];

      for (const employee of employees) {
        const employeeMap: {
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

        let salaryWillGet = 0;
        if (employee.type === EmployeeTypeEnum.FULL_TIME) {
          // I assume salary will be integer in this assessment
          const dailyRate = Math.floor(employeeMap.baseSalary / daysInMonth);
          salaryWillGet = dailyRate * employeeMap.dayOfWorks;
        } else {
          const dailyRate = employeeMap.baseSalary;
          salaryWillGet = dailyRate * employeeMap.dayOfWorks;
        }

        const employeeTypeEntity = new EmployeeType();
        employeeTypeEntity.create({ type: employeeMap.type });
        const employeeEntity = new Employee();
        employeeEntity.create({
          id: employeeMap.id,
          employeeType: employeeTypeEntity,
          name: employeeMap.name,
        });

        let balanceAfter = employeeMap.currentBalance + salaryWillGet;

        const employeeWallet = new EmployeeWallet();
        employeeWallet.create({
          balance: balanceAfter,
          employee: employeeEntity,
        });
        employeeWallet.id = employeeMap.employeeWalletId;

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
          previousBalance: employeeMap.currentBalance,
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
