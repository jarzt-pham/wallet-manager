import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeWallet } from './domain/entities/employee-wallet.entity';
import { EmployeeWalletLog } from './domain/entities/employee-wallet-log.entity';
import { WalletController } from './presentation';
import { WalletService } from './infrastructure/services/wallet.service';
import { WalletProcessor } from './processors/wallet.processor';
import { WalletLogProcessor } from './processors/wallet-log.processor';
import { EmployeeModule } from '../employee';
import { BullModule } from '@nestjs/bull';
import { Configuration } from '../../configuration';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from '../job';
import { UpdateWalletUsecase } from './application/commands';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([EmployeeWallet, EmployeeWalletLog]),

    BullModule.forRootAsync(Configuration.BullConfiguration.Async),
    BullModule.registerQueue(...Configuration.BullConfiguration.Register),

    EmployeeModule,
    JobModule,
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletProcessor,
    WalletLogProcessor,
    UpdateWalletUsecase,
  ],
  exports: [WalletProcessor, WalletLogProcessor, BullModule, WalletService],
})
export class WalletModule {}
