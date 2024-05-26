import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMPLOYEE_TABLE } from '../../infrastructure/tables';
import { CreateEmployeePayload } from './types';

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

  @Column({
    name: EMPLOYEE_TABLE.COLUMNS.DAY_OF_JOIN.NAME,
    type: EMPLOYEE_TABLE.COLUMNS.DAY_OF_JOIN.TYPE,
  })
  dayOfJoin: Date;

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

  set employeeJoinDate(payload: Date) {
    this.dayOfJoin = payload;
  }

  set employeeCreatedAt(payload: Date) {
    this.createdAt = payload;
  }

  set employeeUpdatedAt(payload: Date) {
    this.updatedAt = payload;
  }

  create(payload: CreateEmployeePayload) {
    this.employeeName = payload.name;
    this.employeeJoinDate = payload.dayOfJoin;
    this.employeeCreatedAt = new Date();
  }
}
