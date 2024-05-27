import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMPLOYEE_ATTENDANCE_TABLE } from '../../infrastructure/tables';
import { Employee } from './employee.entity';
import { AttendanceStatusEnum } from './types';

@Entity({
  name: EMPLOYEE_ATTENDANCE_TABLE.NAME,
})
export class EmployeeAttendance {
  @PrimaryGeneratedColumn({
    name: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.ID.NAME,
  })
  id: number;

  @Column({
    name: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.DATE.NAME,
    nullable: false,
  })
  date: Date;

  @Column({
    name: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.STATUS.NAME,
    type: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.STATUS.TYPE,
    enum: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.STATUS.ENUM,
    default: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.STATUS.DEFAULT,
  })
  status: AttendanceStatusEnum;

  @ManyToOne(() => Employee, (employee) => employee.employeeAttendances, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.EMPLOYEE_ID.NAME })
  employee: Employee;

  @CreateDateColumn({
    name: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: EMPLOYEE_ATTENDANCE_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;
}
