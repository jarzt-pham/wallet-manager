import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { AttendanceStatusEnum } from '../domain/entities/types';

export namespace EmployeeValidateUtils {
  export class CreateEmployeePayloadValidate {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    employee_type_id: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    base_salary: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    balance: number;
  }

  export class CreateAttendanceForEmployeePayloadValidate {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    employee_id: number;

    @IsNotEmpty()
    @IsEnum(AttendanceStatusEnum)
    status: AttendanceStatusEnum;
  }
}
