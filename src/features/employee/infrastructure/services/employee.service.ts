import {
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
import { EmployeeExceptions } from '../../exceptions';
import { EmployeeDTO, EmployeeSalaryDTO, EmployeeTypeDTO } from '../dtos';
import { EmployeeWallet } from 'src/features/wallet/domain/entities/employee-wallet.entity';
import { EmployeeWalletDTO } from 'src/features/wallet/infrastructure/dtos/employee-wallet.dto';

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

  async create(createEmployeeDto: {
    name: string;
    employeeTypeId: number;
    baseSalary: number;
    balance: number;
  }) {
    // Depend on the type of employee, base salary will be for day or month
    // Create Employee will create employee information, salary and wallet

    let employeeType: EmployeeType;
    try {
      employeeType = await this._employeeTypeRepo.findOne({
        where: {
          id: createEmployeeDto.employeeTypeId,
        },
      });
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!employeeType) {
      throw new EmployeeExceptions.EmployeeTypeNotFoundException(
        createEmployeeDto.employeeTypeId,
      );
    }

    const employee = new Employee();
    employee.create({
      name: createEmployeeDto.name,
      employeeType,
    });

    const employeeSalary = new EmployeeSalary();
    employeeSalary.create({
      employee,
      baseSalary: createEmployeeDto.baseSalary,
    });

    const employeeWallet = new EmployeeWallet();
    employeeWallet.create({
      balance: createEmployeeDto.balance,
      employee,
    });

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
        base_salary: employeeSalary.baseSalary,
      },
      wallet: {
        ballance: +employeeWallet.balance,
      },
    };
  }

  // findAll() {
  //   return `This action returns all employee`;
  // }

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
