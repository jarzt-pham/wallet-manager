import { Employee } from 'src/features/employee/domain/entities/employee.entity';

export type CreateEmployeeWalletPayload = {
  balance: number;
  employee: Employee
};
