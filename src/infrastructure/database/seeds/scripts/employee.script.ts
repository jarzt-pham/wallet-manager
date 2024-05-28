import { DataSource } from 'typeorm';
import {
  EMPLOYEE_SALARY_TABLE,
  EMPLOYEE_TABLE,
  EMPLOYEE_TYPE_TABLE,
} from 'src/features/employee/infrastructure/tables';
import { EmployeeType } from 'src/features/employee/domain/entities/employee-type.entity';
import { Employee } from 'src/features/employee/domain/entities/employee.entity';
import { EmployeeSalary } from 'src/features/employee/domain/entities/employee-salary.entity';
import { EmployeeWallet } from 'src/features/wallet/domain/entities/employee-wallet.entity';
import { createAlterIncrementQuery } from './common.script';

import employeeTypeData from '../mocks/employee-type.json';
import employeeData from '../mocks/employee.json';
import employeeSalary from '../mocks/employee-salary.json';
import employeeWallet from '../mocks/employee-wallet.json';

import employeeAttendanceForNguyenVanA from '../mocks/employee-attendance-nguyen-van-a.json';
import employeeAttendanceForNguyenVanB from '../mocks/employee-attendance-nguyen-van-b.json';
import employeeAttendanceForPhamDongB from '../mocks/employee-attendance-pham-dong-b.json';
import { EmployeeAttendance } from 'src/features/employee/domain/entities/employee-attendance.entity';

const truncateEmployeeType = async (dataSource: DataSource) => {
  const isRunTruncateSuccessful = true;

  try {
    let employeeTypeDTO: EmployeeType[] =
      await dataSource.manager.find(EmployeeType);

    if (employeeTypeDTO.length > 0) {
      return !isRunTruncateSuccessful;
    }

    dataSource.manager.delete(EmployeeType, {});
    dataSource.query(
      createAlterIncrementQuery({
        column: EMPLOYEE_TYPE_TABLE.COLUMNS.ID.NAME,
        name: EMPLOYEE_TYPE_TABLE.NAME,
      }),
    );

    return isRunTruncateSuccessful;
  } catch (err) {
    console.error({ err });
    return !isRunTruncateSuccessful;
  }
};

const truncateEmployee = async (dataSource: DataSource) => {
  const isRunTruncateSuccessful = true;

  try {
    let employeeDTO: Employee[] = await dataSource.manager.find(Employee);

    if (employeeDTO.length > 0) {
      return !isRunTruncateSuccessful;
    }

    dataSource.manager.delete(Employee, {});
    dataSource.query(
      createAlterIncrementQuery({
        column: EMPLOYEE_TABLE.COLUMNS.ID.NAME,
        name: EMPLOYEE_TABLE.NAME,
      }),
    );

    return isRunTruncateSuccessful;
  } catch (err) {
    console.error({ err });
    return !isRunTruncateSuccessful;
  }
};

const truncateEmployeeSalary = async (dataSource: DataSource) => {
  const isRunTruncateSuccessful = true;

  try {
    let employeeSalaryDTO: EmployeeSalary[] =
      await dataSource.manager.find(EmployeeSalary);

    if (employeeSalaryDTO.length > 0) {
      return !isRunTruncateSuccessful;
    }

    dataSource.manager.delete(Employee, {});
    dataSource.query(
      createAlterIncrementQuery({
        column: EMPLOYEE_SALARY_TABLE.COLUMNS.ID.NAME,
        name: EMPLOYEE_SALARY_TABLE.NAME,
      }),
    );

    return isRunTruncateSuccessful;
  } catch (err) {
    console.error({ err });
    return !isRunTruncateSuccessful;
  }
};

const truncateEmployeeWallet = async (dataSource: DataSource) => {
  const isRunTruncateSuccessful = true;

  try {
    let employeeWalletDTO: EmployeeWallet[] =
      await dataSource.manager.find(EmployeeWallet);

    if (employeeWalletDTO.length > 0) {
      return !isRunTruncateSuccessful;
    }

    dataSource.manager.delete(Employee, {});
    dataSource.query(
      createAlterIncrementQuery({
        column: EMPLOYEE_TABLE.COLUMNS.ID.NAME,
        name: EMPLOYEE_TABLE.NAME,
      }),
    );

    return isRunTruncateSuccessful;
  } catch (err) {
    console.error({ err });
    return !isRunTruncateSuccessful;
  }
};

const truncateEmployeeAttendance = async (dataSource: DataSource) => {
  const isRunTruncateSuccessful = true;

  try {
    let employeeAttendanceDTO: EmployeeAttendance[] =
      await dataSource.manager.find(EmployeeAttendance);

    if (employeeAttendanceDTO.length > 0) {
      return !isRunTruncateSuccessful;
    }

    dataSource.manager.delete(Employee, {});
    dataSource.query(
      createAlterIncrementQuery({
        column: EMPLOYEE_TABLE.COLUMNS.ID.NAME,
        name: EMPLOYEE_TABLE.NAME,
      }),
    );

    return isRunTruncateSuccessful;
  } catch (err) {
    console.error({ err });
    return !isRunTruncateSuccessful;
  }
};

const truncateEmployeeDomain = async (dataSource: DataSource) => {
  let isTruncate: boolean = false;
  isTruncate = await truncateEmployeeSalary(dataSource);
  isTruncate = await truncateEmployeeWallet(dataSource);
  isTruncate = await truncateEmployeeAttendance(dataSource);
  isTruncate = await truncateEmployeeType(dataSource);
  isTruncate = await truncateEmployee(dataSource);

  if (!isTruncate) return false;

  return true;
};

const initDataForEmployeeType = async (dataSource: DataSource) => {
  const employeeTypeEntities = employeeTypeData.map((d) => {
    const entity = new EmployeeType();
    entity.create({
      type: d.type,
    });

    return entity;
  });

  return dataSource.manager.save(employeeTypeEntities);
};

const initDataForEmployee = async (
  dataSource: DataSource,
  { employeeTypes }: { employeeTypes: EmployeeType[] },
) => {
  const employeeTypeMap = new Map<string, EmployeeType>();
  employeeTypes.forEach((et) => {
    employeeTypeMap.set(et.type, et);
  });

  const employeeEntities = employeeData.map((d) => {
    const entity = new Employee();
    entity.create({
      name: d.name,
      employeeType: employeeTypeMap.get(d.type),
    });

    return entity;
  });

  return dataSource.manager.save(employeeEntities);
};

const initDataForEmployeeSalary = async (
  dataSource: DataSource,
  { employees }: { employees: Employee[] },
) => {
  const employeeMap = new Map<string, Employee>();
  employees.forEach((e) => {
    employeeMap.set(e.name, e);
  });

  const employeeSalaryEntities = employeeSalary.map((d) => {
    const entity = new EmployeeSalary();
    entity.create({
      baseSalary: d.base_salary,
      employee: employeeMap.get(d.employee),
    });

    return entity;
  });

  return dataSource.manager.save(employeeSalaryEntities);
};

const initDataForEmployeeWallet = async (
  dataSource: DataSource,
  { employees }: { employees: Employee[] },
) => {
  const employeeMap = new Map<string, Employee>();
  employees.forEach((e) => {
    employeeMap.set(e.name, e);
  });

  const employeeWalletEntities = employeeWallet.map((d) => {
    const entity = new EmployeeWallet();
    entity.create({
      balance: d.balance,
      employee: employeeMap.get(d.employee),
    });

    return entity;
  });

  return dataSource.manager.save(employeeWalletEntities);
};

const initDataForEmployeeAttendance = async (
  dataSource: DataSource,
  { employees }: { employees: Employee[] },
) => {
  const employeeMap = new Map<string, Employee>();
  employees.forEach((e) => {
    employeeMap.set(e.name, e);
  });

  const employeeAttendanceEntities = [
    ...employeeAttendanceForNguyenVanA,
    ...employeeAttendanceForNguyenVanB,
    ...employeeAttendanceForPhamDongB,
  ].map((d) => {
    const entity = new EmployeeAttendance();
    entity.create({
      employee: employeeMap.get(d.employee_name),
      date: new Date(d.date),
      status: d.status as any,
    });

    return entity;
  });

  return dataSource.manager.save(employeeAttendanceEntities);
};

export const initSeedEmployeeDomain = async (dataSource: DataSource) => {
  console.info('Seeding employee domain...');
  const isTruncate = await truncateEmployeeDomain(dataSource);
  if (!isTruncate) {
    console.log('Employee Cluster has data. Seeding employee domain stopped!');
    return;
  }

  const queryRunner = dataSource.createQueryRunner();
  queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const employeeType = await initDataForEmployeeType(dataSource);
    const employee = await initDataForEmployee(dataSource, {
      employeeTypes: employeeType,
    });
    await initDataForEmployeeSalary(dataSource, { employees: employee });
    await initDataForEmployeeWallet(dataSource, { employees: employee });
    await initDataForEmployeeAttendance(dataSource, { employees: employee });

    await queryRunner.commitTransaction();
  } catch (err) {
    console.error({ err });
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
    console.log('Seeding employee domain completed!');
  }
};
