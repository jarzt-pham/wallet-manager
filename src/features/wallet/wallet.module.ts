import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeWallet } from './domain/entities/employee-wallet.entity';
import { EmployeeWalletLog } from './domain/entities/employee-wallet-log.entity';
import { WalletController } from './presentation';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeWallet, EmployeeWalletLog])],
  controllers: [WalletController],
  providers: [],
})
export class WalletModule {}
