import { Controller, Get } from '@nestjs/common';
import { WalletService } from '../infrastructure/services/wallet.service';

@Controller('wallets')
export class WalletController {
  constructor(private readonly _walletService: WalletService) {}

  @Get('/trigger')
  async executeUpdateWalletBalance() {
    await this._walletService.triggerForTesting();
    return 'wallets';
  }
}
