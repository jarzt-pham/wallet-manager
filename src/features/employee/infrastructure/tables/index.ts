import { ColumnType } from 'typeorm';

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
