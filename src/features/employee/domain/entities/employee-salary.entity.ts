import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  EMPLOYEE_TABLE,
  EMPLOYEE_SALARY_TABLE,
} from '../../infrastructure/tables';
import { Employee } from './employee.entity';
import { CreateEmployeeSalaryPayload } from './types';

@Entity({
  name: EMPLOYEE_SALARY_TABLE.NAME,
})
export class EmployeeSalary {
  @PrimaryGeneratedColumn({
    name: EMPLOYEE_SALARY_TABLE.COLUMNS.ID.NAME,
  })
  id: number;

  @Column({
    name: EMPLOYEE_SALARY_TABLE.COLUMNS.BASE_SALARY.NAME,
    type: EMPLOYEE_SALARY_TABLE.COLUMNS.BASE_SALARY.TYPE,
    nullable: false,
  })
  baseSalary: number;
  
  @OneToOne(() => Employee, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: EMPLOYEE_SALARY_TABLE.COLUMNS.EMPLOYEE_ID.NAME })
  employee: Employee;

  @CreateDateColumn({
    name: EMPLOYEE_SALARY_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: EMPLOYEE_SALARY_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;

  create(payload: CreateEmployeeSalaryPayload) {
    this.employee = payload.employee;
    this.createdAt = new Date();
  }
}
