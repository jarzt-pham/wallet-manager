import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EMPLOYEE_WALLET_LOG_TABLE } from '../../infrastructure';
import { EmployeeWallet } from './employee-wallet.entity';
import { CreateEmployeeWalletLogPayload } from './types';

@Entity({
  name: EMPLOYEE_WALLET_LOG_TABLE.NAME,
})
export class EmployeeWalletLog {
  @PrimaryGeneratedColumn({
    name: EMPLOYEE_WALLET_LOG_TABLE.COLUMNS.ID.NAME,
  })
  id: number;

  @Column({
    name: EMPLOYEE_WALLET_LOG_TABLE.COLUMNS.PREVIOUS_BALANCE.NAME,
  })
  previousBalance: number;

  @Column({
    name: EMPLOYEE_WALLET_LOG_TABLE.COLUMNS.NEW_BALANCE.NAME,
  })
  newBalance: number;

  @Column({
    name: EMPLOYEE_WALLET_LOG_TABLE.COLUMNS.AMOUNT_CHANGED.NAME,
  })
  amountChanged: number;

  @ManyToOne(() => EmployeeWallet, (ew) => ew.employeeWalletLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: EMPLOYEE_WALLET_LOG_TABLE.COLUMNS.WALLET_ID.NAME })
  employeeWallet: EmployeeWallet;

  @Column({
    name: EMPLOYEE_WALLET_LOG_TABLE.COLUMNS.DESCRIPTION.NAME,
    type: 'text',
  })
  description: string;

  @CreateDateColumn({
    name: EMPLOYEE_WALLET_LOG_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  create(payload: CreateEmployeeWalletLogPayload) {
    this.previousBalance = payload.previousBalance;
    this.newBalance = payload.newBalance;
    this.description = payload.description;
    this.amountChanged = payload.amountChanged;
    this.employeeWallet = payload.employeeWallet;
    this.createdAt = new Date();
  }
}
