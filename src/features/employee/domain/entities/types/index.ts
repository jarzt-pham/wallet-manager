import { EmployeeType } from '../employee-type.entity';

export type CreateEmployeePayload = {
  name: string;
  employeeType: EmployeeType;
};
