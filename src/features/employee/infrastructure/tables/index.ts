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
    DAY_OF_JOIN: {
      NAME: 'day_of_join',
      TYPE: <ColumnType>'timestamptz',
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
    UPDATED_AT: {
      NAME: 'updated_at',
    },
  },
});
