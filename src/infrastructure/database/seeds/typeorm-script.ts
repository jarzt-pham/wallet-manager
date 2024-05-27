import { DataSource } from 'typeorm';
import { EMPLOYEE_TYPE_TABLE } from 'src/features/employee/infrastructure/tables';
import employeeTypeData from './mocks/employee-type.json';
import { EmployeeType } from 'src/features/employee/domain/entities/employee-type.entity';

const createAlterIncrementQuery = (
  table: {
    name: string;
    column: string;
  },
  start: number = 1,
) =>
  `SELECT pg_get_serial_sequence('${table.name}', '${table.column}');SELECT setval('${table.name}_${table.column}_seq', ${start}, false);`;

const truncateEmployee = async (dataSource: DataSource) => {
  const isRunTruncateSuccessful = true;

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    let employeeTypeDTO: EmployeeType[] =
      await queryRunner.manager.find(EmployeeType);

    if (employeeTypeDTO.length > 0) {
      await queryRunner.commitTransaction();
      return !isRunTruncateSuccessful;
    }

    queryRunner.manager.delete(EmployeeType, {});
    queryRunner.query(
      createAlterIncrementQuery({
        column: EMPLOYEE_TYPE_TABLE.COLUMNS.ID.NAME,
        name: EMPLOYEE_TYPE_TABLE.NAME,
      }),
    );

    await queryRunner.commitTransaction();
    return isRunTruncateSuccessful;
  } catch (err) {
    console.error({ err });
    await queryRunner.rollbackTransaction();
    return !isRunTruncateSuccessful;
  } finally {
    await queryRunner.release();
  }
};

export const initDataForEmployee = async (dataSource: DataSource) => {
  const isTruncate = await truncateEmployee(dataSource);
  if (!isTruncate) return;

  const queryRunner = dataSource.createQueryRunner();

  const employeeTypeEntities = employeeTypeData.map((d) => {
    const entity = new EmployeeType();
    entity.create({
      type: d.type,
    });

    return entity;
  });

  queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(employeeTypeEntities);

    await queryRunner.commitTransaction();
  } catch (err) {
    console.error({ err });
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
};
