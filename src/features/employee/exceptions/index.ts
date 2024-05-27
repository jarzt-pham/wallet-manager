import { HttpException } from '@nestjs/common';
import { Employee } from '../domain/entities/employee.entity';

export namespace EmployeeExceptions {
  export class EmployeeNotFoundException extends Error {
    constructor(employeeId: string) {
      super(`Employee with id ${employeeId} not found`);
    }
  }

  export class EmployeeAlreadyExistsException extends Error {
    constructor(employee: Employee) {
      super(`Employee with id ${employee.id} already exists`);
    }
  }

  export class EmployeeTypeNotFoundException extends HttpException {
    constructor(employeeTypeId: number) {
      super(`Employee type with id ${employeeTypeId} not found`, 404);
    }
  }
}
