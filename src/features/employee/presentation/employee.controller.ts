import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmployeeService } from '../infrastructure';
import { EmployeeValidateUtils } from '../validates';
import { FindAllEmployeesUsecase } from '../application/queries/find-all-employees.usecase';
import { CreateAnEmployeeUsecase } from '../application/commands/create-an-employee.usecase';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly _employeeService: EmployeeService,
    private readonly _findAllUsecase: FindAllEmployeesUsecase,
    private readonly _createAnEmployeeUsecase: CreateAnEmployeeUsecase,
  ) {}

  @Get('/')
  async findAll() {
    return this._findAllUsecase.execute();
  }

  @Post('/')
  async create(
    @Body()
    payload: EmployeeValidateUtils.CreateEmployeePayloadValidate,
  ) {
    return this._createAnEmployeeUsecase.execute({
      name: payload.name,
      employeeTypeId: payload.employee_type_id,
      baseSalary: payload.base_salary,
      balance: payload.balance,
    });
  }
}
