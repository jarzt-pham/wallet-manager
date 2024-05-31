import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  EmployeeDao,
  EmployeeDetailDto,
} from '../../infrastructure/daos/employee.dao';
import {
  CreateEmployeeServiceOutput,
  EmployeeService,
} from '../../infrastructure';
import { EmployeeExceptions } from '../../exceptions';
import { EmployeeType } from '../../domain/entities/employee-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../domain/entities/employee.entity';
import { Repository } from 'typeorm';
import { EmployeeSalary } from '../../domain/entities/employee-salary.entity';
import { EmployeeWallet } from 'src/features/wallet/domain/entities/employee-wallet.entity';
import { AttendanceStatusEnum } from '../../domain/entities/types';
import { EmployeeAttendance } from '../../domain/entities/employee-attendance.entity';

type CreateAnAttendanceForEmployeeUsecaseOutput = {
  id: number;
  date: Date;
  status: AttendanceStatusEnum;
  employee: {
    id: number;
    name: string;
  };
};

@Injectable()
export class CreateAnAttendanceForEmployeeUsecase {
  private _logger: Logger;
  constructor(
    private readonly _employeeService: EmployeeService,
    @InjectRepository(Employee)
    private _employeeRepo: Repository<Employee>,
    @InjectRepository(EmployeeType)
    private _employeeTypeRepo: Repository<EmployeeType>,
    @InjectRepository(EmployeeSalary)
    private _employeeSalaryRepo: Repository<EmployeeSalary>,
    @InjectRepository(EmployeeAttendance)
    private _employeeAttendanceRepo: Repository<EmployeeAttendance>,
  ) {
    this._logger = new Logger(CreateAnAttendanceForEmployeeUsecase.name);
  }

  async execute(payload: {
    date: Date;
    status: AttendanceStatusEnum;
    employee_id: number;
  }): Promise<any> {
    let employee: Employee;
    try {
      employee = await this._employeeRepo.findOne({
        where: {
          id: payload.employee_id,
        },
      });
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    if (!employee) {
      throw new EmployeeExceptions.EmployeeNotFoundException(
        payload.employee_id,
      );
    }

    let employeeAttendance: EmployeeAttendance;
    try {
      employeeAttendance = await this._employeeAttendanceRepo.findOne({
        where: {
          date: payload.date,
          employee: {
            id: payload.employee_id,
          },
        },
      });
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    if (employeeAttendance) {
      throw new EmployeeExceptions.EmployeeAttendanceAlreadyExistException(
        payload.employee_id,
        payload.date,
      );
    }

    employeeAttendance = new EmployeeAttendance();
    employeeAttendance.create({
      date: payload.date,
      status: payload.status,
      employee,
    });

    try {
      await this._employeeAttendanceRepo.save(employeeAttendance);
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    return this.mapper(employeeAttendance);
  }

  mapper(
    payload: EmployeeAttendance,
  ): CreateAnAttendanceForEmployeeUsecaseOutput {
    return {
      id: payload.id,
      date: payload.date,
      status: payload.status,
      employee: {
        id: payload.employee.id,
        name: payload.employee.name,
      },
    };
  }
}
