import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

//ignore barbel pattern error NestJs
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeSalary } from '../../domain/entities/employee-salary.entity';
import { EmployeeType } from '../../domain/entities/employee-type.entity';

import { DataSource, Repository } from 'typeorm';
import { EmployeeWallet } from '../../../wallet/domain/entities/employee-wallet.entity';

export type CreateEmployeeServiceOutput = {
  id: number;
  name: string;
  employee_type: {
    id: number;
    type: string;
  };
  salary: {
    id: number;
    base_salary: number;
  };
  wallet: {
    id: number;
    ballance: number;
  };
};

@Injectable()
export class EmployeeService {
  private readonly _logger: Logger;
  constructor(
    private readonly _dataSource: DataSource,

    @InjectRepository(Employee)
    private _employeeRepo: Repository<Employee>,
    @InjectRepository(EmployeeType)
    private _employeeTypeRepo: Repository<EmployeeType>,
    @InjectRepository(EmployeeSalary)
    private _employeeSalaryRepo: Repository<EmployeeSalary>,

    @InjectRepository(EmployeeWallet)
    private _employeeWalletRepo: Repository<EmployeeWallet>,
  ) {
    this._logger = new Logger(EmployeeService.name);
  }

  async createEmployee({
    employee,
    employeeSalary,
    employeeWallet,
    employeeType,
  }: {
    employee: Employee;
    employeeSalary: EmployeeSalary;
    employeeWallet: EmployeeWallet;
    employeeType: EmployeeType;
  }): Promise<CreateEmployeeServiceOutput> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this._employeeRepo.save(employee);

      await Promise.all([
        this._employeeSalaryRepo.save(employeeSalary),
        this._employeeWalletRepo.save(employeeWallet),
      ]);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this._logger.error(error.message);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return {
      id: employee.id,
      name: employee.name,
      employee_type: {
        id: employeeType.id,
        type: employeeType.type,
      },
      salary: {
        id: employeeSalary.id,
        base_salary: employeeSalary.baseSalary,
      },
      wallet: {
        id: employeeWallet.id,
        ballance: +employeeWallet.balance,
      },
    };
  }

  async countEmployees() {
    return this._employeeRepo.count();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} employee`;
  // }

  // update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
  //   return `This action updates a #${id} employee`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} employee`;
  // }
}
