import { EmployeeType } from '../employee-type.entity';

export type CreateEmployeePayload = {
  id?: number;
  name: string;
  employeeType: EmployeeType;
};
