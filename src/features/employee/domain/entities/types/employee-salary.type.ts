import { Employee } from '../employee.entity';

export type CreateEmployeeSalaryPayload = {
  employee: Employee;
  baseSalary: number;
};
