import { Module } from '@nestjs/common';
import { EmployeeService } from './infrastructure/services/employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Employee,
  EmployeeAttendance,
  EmployeeSalary,
  EmployeeSalaryType,
  EmployeeType,
} from './domain';
import { EmployeeController } from './presentation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeType,

      EmployeeSalary,
      EmployeeSalaryType,

      EmployeeAttendance,
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
