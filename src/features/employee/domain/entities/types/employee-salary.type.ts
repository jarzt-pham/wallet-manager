import { EmployeeSalaryType } from '../employee-salary-type.entity';
import { Employee } from '../employee.entity';

export type CreateEmployeeSalaryPayload = {
  employee: Employee;
  employeeSalaryType: EmployeeSalaryType;
};
