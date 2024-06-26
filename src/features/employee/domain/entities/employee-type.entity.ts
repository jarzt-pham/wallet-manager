import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMPLOYEE_TYPE_TABLE } from '../../infrastructure/tables';
import { Employee } from './employee.entity';
import { CreateEmployeeTypePayload } from './types';

@Entity({
  name: EMPLOYEE_TYPE_TABLE.NAME,
})
export class EmployeeType {
  @PrimaryGeneratedColumn({
    name: EMPLOYEE_TYPE_TABLE.COLUMNS.ID.NAME,
  })
  id: number;

  @Column({
    name: EMPLOYEE_TYPE_TABLE.COLUMNS.TYPE.NAME,
    type: EMPLOYEE_TYPE_TABLE.COLUMNS.TYPE.TYPE,
    length: EMPLOYEE_TYPE_TABLE.COLUMNS.TYPE.LENGTH,
  })
  type: string;

  @OneToMany(() => Employee, (employee) => employee.employeeType)
  employees: Employee[];

  @CreateDateColumn({
    name: EMPLOYEE_TYPE_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: EMPLOYEE_TYPE_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;

  create(payload: CreateEmployeeTypePayload) {
    this.type = payload.type;
    this.createdAt = new Date();
  }
}
