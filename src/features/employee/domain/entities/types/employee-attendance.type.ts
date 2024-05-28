import { Employee } from '../employee.entity';

export enum AttendanceStatusEnum {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
}

export type CreateEmployeeAttendancePayload = {
  date: Date;
  status: AttendanceStatusEnum;
  employee: Employee;
};
