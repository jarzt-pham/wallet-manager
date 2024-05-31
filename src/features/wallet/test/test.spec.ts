import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletModule } from '../wallet.module';
import { WalletService } from '../infrastructure/services/wallet.service';
import { getDaysInMonth } from '../../../utils';
import { EmployeeTypeEnum } from '../../employee/domain/entities/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../../../configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { EmployeeModule } from '../../../features/employee';
import { AppController } from '../../../app.controller';
import { AppService } from '../../../app.service';
import { UpdateWalletUsecase } from '../application/commands';
import { InternalServerErrorException } from '@nestjs/common';
import { EmployeeDao } from '../../employee/infrastructure/daos/employee.dao';
import { EmployeeWallet } from '../domain/entities/employee-wallet.entity';

describe('Calculate salary', () => {
  let service: WalletService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync(Configuration.TypeOrmConfiguration.Async),

        ScheduleModule.forRoot(),

        EmployeeModule,
        WalletModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  const mockEmployeeInformation = {
    baseSalary: 3000,
    currentBalance: 1000,
    daysInMonth: getDaysInMonth(new Date()),
    dayOfWorks: 20,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate salary correctly for a full-time employee', () => {
    const result = service.calculateSalary({
      baseSalary: mockEmployeeInformation.baseSalary,
      currentBalance: mockEmployeeInformation.currentBalance,
      dayOfWorks: mockEmployeeInformation.dayOfWorks,
      type: EmployeeTypeEnum.FULL_TIME,
    });

    const expectedDailyRate = Math.floor(
      mockEmployeeInformation.baseSalary / mockEmployeeInformation.daysInMonth,
    );
    const expectedSalaryWillGet =
      expectedDailyRate * mockEmployeeInformation.dayOfWorks;
    const expectedBalanceAfter =
      mockEmployeeInformation.currentBalance + expectedSalaryWillGet;

    expect(result.dailyRate).toEqual(expectedDailyRate);
    expect(result.salaryWillGet).toEqual(expectedSalaryWillGet);
    expect(result.balanceAfter).toEqual(expectedBalanceAfter);
  });

  it('should calculate salary correctly for a part-time employee', () => {
    const result = service.calculateSalary({
      baseSalary: mockEmployeeInformation.baseSalary,
      currentBalance: mockEmployeeInformation.currentBalance,
      dayOfWorks: mockEmployeeInformation.dayOfWorks,
      type: EmployeeTypeEnum.PART_TIME,
    });

    const expectedDailyRate = mockEmployeeInformation.baseSalary;
    const expectedSalaryWillGet =
      expectedDailyRate * mockEmployeeInformation.dayOfWorks;
    const expectedBalanceAfter =
      mockEmployeeInformation.currentBalance + expectedSalaryWillGet;

    expect(result.dailyRate).toEqual(expectedDailyRate);
    expect(result.salaryWillGet).toEqual(expectedSalaryWillGet);
    expect(result.balanceAfter).toEqual(expectedBalanceAfter);
  });
});

describe('UpdateWalletUsecase', () => {
  let usecase: UpdateWalletUsecase;
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync(Configuration.TypeOrmConfiguration.Async),

        ScheduleModule.forRoot(),

        EmployeeModule,
        WalletModule,
      ],
      controllers: [AppController],
      providers: [
        AppService,
        UpdateWalletUsecase,
        {
          provide: WalletService,
          useValue: {
            calculateSalary: jest.fn(),
            updateWallet: jest.fn(),
          },
        },
      ],
    }).compile();

    usecase = module.get<UpdateWalletUsecase>(UpdateWalletUsecase);
    walletService = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should execute update wallet employee full-time successfully', async () => {
    const payload = {
      id: 10,
      base_salary: 3000,
      day_of_works: 20,
      type: EmployeeTypeEnum.FULL_TIME,
      name: 'TESTING',
      employee_wallet_id: 123,
      current_balance: 1000,
    };

    const expectedDailyRate = Math.floor(
      payload.base_salary / getDaysInMonth(new Date()),
    );
    const expectedSalaryWillGet = expectedDailyRate * payload.day_of_works;
    const expectedBalanceAfter =
      payload.current_balance + expectedSalaryWillGet;

    const expectedResult = {
      id: 10,
      baseSalary: 3000,
      dayOfWorks: 20,
      type: EmployeeTypeEnum.FULL_TIME,
      name: 'TESTING',
      employeeWalletId: 123,
      currentBalance: expectedBalanceAfter,
    };

    await expect(usecase.execute(payload)).resolves.toEqual(expectedResult);
  });
});
