import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

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
}
