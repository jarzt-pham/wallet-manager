import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmployeeService } from '../infrastructure';
import { EmployeeValidateUtils } from '../validates';
import { FindAllEmployeesUsecase } from '../application/queries/find-all-employees.usecase';
import { CreateAnEmployeeUsecase } from '../application/commands/create-an-employee.usecase';
import { CreateAnAttendanceForEmployeeUsecase } from '../application/commands';

@Controller('v1/employees')
export class EmployeeController {
  constructor(
    private readonly _employeeService: EmployeeService,
    private readonly _findAllUsecase: FindAllEmployeesUsecase,
    private readonly _createAnEmployeeUsecase: CreateAnEmployeeUsecase,
    private readonly _createAnAttendanceUsecase: CreateAnAttendanceForEmployeeUsecase,
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

  @Post('/attendances')
  async createAnAttendance(
    @Body()
    payload: EmployeeValidateUtils.CreateAttendanceForEmployeePayloadValidate,
  ) {
    return this._createAnAttendanceUsecase.execute({
      date: new Date(payload.date),
      employee_id: payload.employee_id,
      status: payload.status,
    });
  }
}
