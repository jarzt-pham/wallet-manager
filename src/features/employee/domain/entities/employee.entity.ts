import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMPLOYEE_TABLE } from '../../infrastructure/tables';
import { CreateEmployeePayload } from './types';
import { EmployeeType } from './employee-type.entity';

@Entity({
  name: EMPLOYEE_TABLE.NAME,
})
export class Employee {
  @PrimaryGeneratedColumn({
    name: EMPLOYEE_TABLE.COLUMNS.ID.NAME,
  })
  id: number;

  @Column({
    name: EMPLOYEE_TABLE.COLUMNS.NAME.NAME,
    type: EMPLOYEE_TABLE.COLUMNS.NAME.TYPE,
    length: EMPLOYEE_TABLE.COLUMNS.NAME.LENGTH,
  })
  name: string;

  @ManyToOne(() => EmployeeType, (employee) => employee.employees)
  @JoinColumn({ name: EMPLOYEE_TABLE.COLUMNS.EMPLOYEE_TYPE_ID.NAME })
  employeeType: EmployeeType;

  @CreateDateColumn({
    name: EMPLOYEE_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: EMPLOYEE_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;

  set employeeName(payload: string) {
    this.name = payload;
  }

  set employeeCreatedAt(payload: Date) {
    this.createdAt = payload;
  }

  set employeeUpdatedAt(payload: Date) {
    this.updatedAt = payload;
  }

  create(payload: CreateEmployeePayload) {
    this.employeeName = payload.name;
    this.employeeType = payload.employeeType;
    this.employeeCreatedAt = new Date();
  }
}
