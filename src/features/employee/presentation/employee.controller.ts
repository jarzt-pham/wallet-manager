import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { EmployeeService } from '../infrastructure';
import { EmployeeValidateUtils } from '../validates';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/')
  async create(
    @Body()
    payload: EmployeeValidateUtils.CreateEmployeePayloadValidate
  ) {
    return this.employeeService.create({
      name: payload.name,
      employeeTypeId: payload.employee_type_id,
      baseSalary: payload.base_salary,
      balance: payload.balance,
    });
  }
}
