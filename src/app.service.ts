import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JOB_QUEUE } from './features/job/queue';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmployeeService } from './features/employee/infrastructure';
import { ConfigService } from '@nestjs/config';
import { initSeedEmployeeDomain } from './infrastructure';
import { WalletService } from './features/wallet/infrastructure/services/wallet.service';

@Injectable()
export class AppService implements OnModuleInit {
  logger: Logger;
  constructor(
    private _configService: ConfigService,
    private readonly _dataSource: DataSource,
    private readonly _employeeService: EmployeeService,
    private readonly _walletService: WalletService,
    @InjectQueue(JOB_QUEUE.WALLET) private _walletQueue: Queue,
  ) {
    this.logger = new Logger(AppService.name);
  }

  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
    initSeedEmployeeDomain({
      dataSource: this._dataSource,
      logger: this.logger,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.scheduleDailyCalculateAndUpdateBalance();
  }

  async scheduleDailyCalculateAndUpdateBalance() {
    const totalEmployees = await this._employeeService.countEmployees();
    const NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY =
      this._walletService.NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY;

    const totalBatches = this._walletService.calculateBatch({
      totalEmployees,
      employeePerUpdating: NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
    });

    for (let batch = 0; batch < totalBatches; batch++) {
      await this._walletQueue.add({
        batch,
        paging: {
          limit: NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
          offset: batch * NUMBER_OF_EMPLOYEES_TO_UPDATE_NIGHTLY,
        },
      });
    }
  }
}
