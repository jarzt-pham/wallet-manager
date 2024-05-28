import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMPLOYEE_WALLET_TABLE } from '../../infrastructure';
import { Employee } from 'src/features/employee/domain/entities/employee.entity';
import { EmployeeWalletLog } from './employee-wallet-log.entity';
import { CreateEmployeeWalletPayload } from './types/employee-wallet.type';

@Entity({
  name: EMPLOYEE_WALLET_TABLE.NAME,
})
export class EmployeeWallet {
  @PrimaryGeneratedColumn({
    name: EMPLOYEE_WALLET_TABLE.COLUMNS.ID.NAME,
  })
  id: number;

  @Column({
    name: EMPLOYEE_WALLET_TABLE.COLUMNS.BALANCE.NAME,
  })
  balance: number;

  @OneToOne(() => Employee, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: EMPLOYEE_WALLET_TABLE.COLUMNS.EMPLOYEE_ID.NAME })
  employee: Employee;

  @OneToMany(() => EmployeeWalletLog, (ewl) => ewl.employeeWallet)
  employeeWalletLogs: EmployeeWalletLog[];

  @CreateDateColumn({
    name: EMPLOYEE_WALLET_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: EMPLOYEE_WALLET_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;

  create(payload: CreateEmployeeWalletPayload) {
    this.id = payload?.id ? payload.id : undefined;
    this.balance = payload.balance;
    this.employee = payload.employee;
    this.createdAt = new Date();
  }
}
