import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMPLOYEE_TABLE } from '../../infrastructure/tables';
import { CreateEmployeePayload } from './types';
import { EmployeeType } from './employee-type.entity';
import { EmployeeAttendance } from './employee-attendance.entity';

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
    nullable: false,
  })
  name: string;

  @ManyToOne(() => EmployeeType, (employee) => employee.employees, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: EMPLOYEE_TABLE.COLUMNS.EMPLOYEE_TYPE_ID.NAME })
  employeeType: EmployeeType;

  @OneToMany(() => EmployeeAttendance, (ea) => ea.employee)
  employeeAttendances: EmployeeAttendance[];

  @CreateDateColumn({
    name: EMPLOYEE_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: EMPLOYEE_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;

  create(payload: CreateEmployeePayload) {
    this.id = payload?.id ? payload.id : undefined;
    this.name = payload.name;
    this.employeeType = payload.employeeType;
    this.createdAt = new Date();
  }
}
