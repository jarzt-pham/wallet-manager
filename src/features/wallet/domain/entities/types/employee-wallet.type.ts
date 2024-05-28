import { Employee } from 'src/features/employee/domain/entities/employee.entity';

export type CreateEmployeeWalletPayload = {
  id?: number;
  balance: number;
  employee: Employee;
};
