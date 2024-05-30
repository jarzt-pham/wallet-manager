import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  EmployeeDao,
  EmployeeDetailDto,
} from '../../infrastructure/daos/employee.dao';

type FindAllEmployeesUsecaseOutput = {
  id: number;
  type: string;
  name: string;
  base_salary: number;
  day_of_works: number;
  current_balance: number;
};

@Injectable()
export class FindAllEmployeesUsecase {
  private _logger: Logger;
  constructor(private readonly _employeeDao: EmployeeDao) {
    this._logger = new Logger(FindAllEmployeesUsecase.name);
  }

  async execute(): Promise<FindAllEmployeesUsecaseOutput[]> {
    let employeeDetails: EmployeeDetailDto[];
    try {
      employeeDetails = await this._employeeDao.getEmployeeDetails();
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    return employeeDetails.map((employeeDetail) => this.mapper(employeeDetail));
  }

  mapper(payload: EmployeeDetailDto): FindAllEmployeesUsecaseOutput {
    return {
      id: payload.id,
      name: payload.name,
      type: payload.type,
      base_salary: payload.base_salary,
      current_balance: payload.current_balance,
      day_of_works: payload.day_of_works,
    };
  }
}
