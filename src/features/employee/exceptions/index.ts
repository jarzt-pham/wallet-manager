import { HttpException } from '@nestjs/common';
import { Employee } from '../domain/entities/employee.entity';

export namespace EmployeeExceptions {
  export class EmployeeNotFoundException extends HttpException {
    constructor(employeeId: number) {
      super(`Employee with id ${employeeId} not found`, 400);
    }
  }

  export class EmployeeAlreadyExistsException extends HttpException {
    constructor(employee: Employee) {
      super(`Employee with id ${employee.id} already exists`, 400);
    }
  }

  export class EmployeeTypeNotFoundException extends HttpException {
    constructor(employeeTypeId: number) {
      super(`Employee type with id ${employeeTypeId} not found`, 400);
    }
  }

  export class EmployeeAttendanceAlreadyExistException extends HttpException {
    constructor(employeeId: number, date: Date) {
      super(
        `Employee with id ${employeeId} already has attendance on ${date}`,
        400,
      );
    }
  }
}
