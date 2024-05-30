import { Module } from '@nestjs/common';
import { EmployeeService } from './infrastructure/services/employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeeController } from './presentation';
import { Employee } from './domain/entities/employee.entity';
import { EmployeeType } from './domain/entities/employee-type.entity';
import { EmployeeSalary } from './domain/entities/employee-salary.entity';
import { EmployeeAttendance } from './domain/entities/employee-attendance.entity';
import { EmployeeWallet } from '../wallet/domain/entities/employee-wallet.entity';
import { EmployeeDao } from './infrastructure/daos/employee.dao';
import { FindAllEmployeesUsecase } from './application/queries/find-all-employees.usecase';
import { CreateAnEmployeeUsecase } from './application/commands/create-an-employee.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeType,

      EmployeeSalary,
      EmployeeAttendance,

      EmployeeWallet,
    ]),
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService, 
    EmployeeDao,
  
    FindAllEmployeesUsecase,
    CreateAnEmployeeUsecase
  ],
  exports: [EmployeeService, EmployeeDao, TypeOrmModule],
})
export class EmployeeModule {}
