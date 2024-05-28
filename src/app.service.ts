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

  private async scheduleDailyCalculateAndUpdateBalance() {
    const totalEmployees = await this._employeeService.countEmployees();
    const USER_AMOUNT_UPDATE =
      this._configService.get('USER_AMOUNT_UPDATE') ?? 1;

    const totalBatches = Math.ceil(totalEmployees / USER_AMOUNT_UPDATE);

    for (let batch = 0; batch < totalBatches; batch++) {
      await this._walletQueue.add({
        batch,
        paging: {
          limit: USER_AMOUNT_UPDATE,
          offset: batch * USER_AMOUNT_UPDATE,
        },
      });
    }
  }
}
