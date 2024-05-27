import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EMPLOYEE_SALARY_TYPE_TABLE } from '../../infrastructure';
import { CreateEmployeeSalaryTypePayload } from './types/employee-salary-type.type';
import { EmployeeSalary } from './employee-salary.entity';

@Entity({
  name: EMPLOYEE_SALARY_TYPE_TABLE.NAME,
})
export class EmployeeSalaryType {
  @PrimaryGeneratedColumn({
    name: EMPLOYEE_SALARY_TYPE_TABLE.COLUMNS.ID.NAME,
  })
  id: number;

  @Column({
    name: EMPLOYEE_SALARY_TYPE_TABLE.COLUMNS.TYPE.NAME,
  })
  type: string;

  @OneToMany(() => EmployeeSalary, (es) => es.employeeSalaryType)
  employeeSalaries: EmployeeSalary[];

  @CreateDateColumn({
    name: EMPLOYEE_SALARY_TYPE_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: EMPLOYEE_SALARY_TYPE_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;

  create(payload: CreateEmployeeSalaryTypePayload) {
    this.type = payload.type;
    this.createdAt = new Date();
  }
}
