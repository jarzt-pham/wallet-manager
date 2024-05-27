import { ColumnType } from 'typeorm';
import { AttendanceStatusEnum } from '../../domain/entities/types';

export const EMPLOYEE_TABLE = Object.freeze({
  NAME: 'employees',
  COLUMNS: {
    ID: {
      NAME: 'id',
    },
    NAME: {
      NAME: 'name',
      TYPE: <ColumnType>'varchar',
      LENGTH: 255,
    },
    EMPLOYEE_TYPE_ID: {
      NAME: 'employee_type_id',
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
    UPDATED_AT: {
      NAME: 'updated_at',
    },
  },
});

export const EMPLOYEE_TYPE_TABLE = Object.freeze({
  NAME: 'employee_types',
  COLUMNS: {
    ID: {
      NAME: 'id',
    },
    TYPE: {
      NAME: 'type',
      TYPE: <ColumnType>'varchar',
      LENGTH: 255,
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
    UPDATED_AT: {
      NAME: 'updated_at',
    },
  },
});

export const EMPLOYEE_SALARY_TABLE = Object.freeze({
  NAME: 'employee_salaries',
  COLUMNS: {
    ID: {
      NAME: 'id',
    },
    BASE_SALARY: {
      NAME: 'base_salary',
      TYPE: <ColumnType>'decimal',
      LENGTH: '10, 2',
    },
    EMPLOYEE_ID: {
      NAME: 'employee_id',
    },
    EMPLOYEE_SALARY_TYPE_ID: {
      NAME: 'employee_salary_type_id',
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
    UPDATED_AT: {
      NAME: 'updated_at',
    },
  },
});

export const EMPLOYEE_SALARY_TYPE_TABLE = Object.freeze({
  NAME: 'employee_salary_types',
  COLUMNS: {
    ID: {
      NAME: 'id',
    },
    TYPE: {
      NAME: 'type',
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
    UPDATED_AT: {
      NAME: 'updated_at',
    },
  },
});

export const EMPLOYEE_ATTENDANCE_TABLE = Object.freeze({
  NAME: 'employee_attendances',
  COLUMNS: {
    ID: {
      NAME: 'id',
    },
    DATE: {
      NAME: 'date',
    },
    EMPLOYEE_ID: {
      NAME: 'employee_id',
    },
    STATUS: {
      NAME: 'status',
      TYPE: <ColumnType>'enum',
      ENUM: AttendanceStatusEnum,
      DEFAULT: AttendanceStatusEnum.PRESENT,
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
    UPDATED_AT: {
      NAME: 'updated_at',
    },
  },
});
