import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateEmployeeServiceOutput, EmployeeService } from '../../infrastructure';
import { EmployeeExceptions } from '../../exceptions';
import { EmployeeType } from '../../domain/entities/employee-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../domain/entities/employee.entity';
import { Repository } from 'typeorm';
import { EmployeeSalary } from '../../domain/entities/employee-salary.entity';
import { EmployeeWallet } from '../../../wallet/domain/entities/employee-wallet.entity';

type CreateEmployeeUsecaseOutput = CreateEmployeeServiceOutput;

@Injectable()
export class CreateAnEmployeeUsecase {
  private _logger: Logger;
  constructor(
    private readonly _employeeService: EmployeeService,
    @InjectRepository(Employee)
    private _employeeRepo: Repository<Employee>,
    @InjectRepository(EmployeeType)
    private _employeeTypeRepo: Repository<EmployeeType>,
    @InjectRepository(EmployeeSalary)
    private _employeeSalaryRepo: Repository<EmployeeSalary>,
  ) {
    this._logger = new Logger(CreateAnEmployeeUsecase.name);
  }

  async execute(payload: {
    name: string;
    employeeTypeId: number;
    baseSalary: number;
    balance: number;
  }): Promise<any> {
    // Depend on the type of employee, base salary will be for day or month
    // Create Employee will create employee information, salary and wallet

    let employeeType: EmployeeType;
    try {
      employeeType = await this._employeeTypeRepo.findOne({
        where: {
          id: payload.employeeTypeId,
        },
      });
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!employeeType) {
      throw new EmployeeExceptions.EmployeeTypeNotFoundException(
        payload.employeeTypeId,
      );
    }

    const employee = new Employee();
    employee.create({
      name: payload.name,
      employeeType,
    });

    const employeeSalary = new EmployeeSalary();
    employeeSalary.create({
      employee,
      baseSalary: payload.baseSalary,
    });

    const employeeWallet = new EmployeeWallet();
    employeeWallet.create({
      balance: payload.balance,
      employee,
    });

    let savedEmployee: CreateEmployeeServiceOutput;
    try {
      savedEmployee = await this._employeeService.createEmployee({
        employee,
        employeeSalary,
        employeeWallet,
        employeeType,
      });
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    return this.mapper(savedEmployee);
  }

  mapper(payload: CreateEmployeeServiceOutput): CreateEmployeeUsecaseOutput {
    return payload;
  }
}
