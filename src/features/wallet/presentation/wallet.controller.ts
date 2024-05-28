import { Controller, Get } from '@nestjs/common';
import { WalletService } from '../infrastructure/services/wallet.service';
import { EmployeeService } from 'src/features/employee/infrastructure';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JOB_QUEUE } from 'src/features/job/queue';

@Controller('wallets')
export class WalletController {
  constructor(
    private readonly _walletService: WalletService,
  ) {}

  @Get()
  async executeUpdateWalletBalance() {
    await this._walletService.triggerForTesting();
    return 'wallets';
  }
}
