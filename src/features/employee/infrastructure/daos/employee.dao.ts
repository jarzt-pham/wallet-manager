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
import { EmployeeExceptions } from '../../exceptions';
import { EmployeeWallet } from 'src/features/wallet/domain/entities/employee-wallet.entity';
import { EmployeeAttendance } from '../../domain/entities/employee-attendance.entity';
import { AttendanceStatusEnum } from '../../domain/entities/types';

export type EmployeeDetailDto = {
  id: number;
  name: string;
  base_salary: number;
  day_of_works: number;
  type: string;
  employee_wallet_id: number;
  current_balance: number;
};

@Injectable()
export class EmployeeDao {
  constructor(private readonly _dataSource: DataSource) {}

  async queryCalculateSalary(employeeId: number) {
    const query = this._dataSource
      .getRepository(Employee)
      .createQueryBuilder('employee')
      .innerJoin('employee.employeeType', 'employeeType')
      .innerJoin('employee.employeeAttendances', 'employeeAttendance')
      .innerJoin(
        'EmployeeSalary',
        'employeeSalary',
        'employeeSalary.employee_id = employee.id',
      )
      .where('employee.id = :employeeId', { employeeId })
      .select([
        'employee.id as id',
        'employee.name as name',
        'employeeSalary.baseSalary as base_salary',
      ])
      .getMany();

    return query;
  }

  async getEmployeeDetails(payload?: {
    employeeId?: number;
    paging: {
      limit: number;
      offset: number;
    };
  }): Promise<EmployeeDetailDto[]> {
    const query = this._dataSource
      .getRepository(Employee)
      .createQueryBuilder('employee')
      .innerJoin('employee.employeeType', 'employeeType')
      .innerJoin(
        (subQuery) =>
          subQuery
            .select('COUNT(*)', 'day_of_works')
            .addSelect('employee_id')
            .from(EmployeeAttendance, 'employee_attendances')
            .where(
              'employee_attendances.status = :status1 OR employee_attendances.status = :status2',
              {
                status1: AttendanceStatusEnum.PRESENT,
                status2: AttendanceStatusEnum.LEAVE,
              },
            )
            .groupBy('employee_id'),
        'employee_attendances',
        'employee_attendances.employee_id = employee.id',
      )
      .innerJoin(
        'EmployeeSalary',
        'employee_salary',
        'employee_salary.employee_id = employee.id',
      )
      .innerJoin(
        'EmployeeWallet',
        'employee_wallet',
        'employee_wallet.employee_id = employee.id',
      )
      .select([
        'employee.id as id',
        'employee.name as name',
        'employee_salary.base_salary::integer as base_salary',
        'employee_attendances.day_of_works::integer',
        'employeeType.type',
        'employee_wallet.balance::integer as current_balance',
        'employee_wallet.id::integer as employee_wallet_id',
      ]);

    if (payload?.employeeId)
      query.andWhere('employee.id = :employeeId', {
        employeeId: payload.employeeId,
      });

    if (payload?.paging) {
      query.limit(payload.paging.limit).offset(payload.paging.offset);
    }

    return query.getRawMany();
  }
}
