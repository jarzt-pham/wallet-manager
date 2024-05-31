import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { WalletModule } from '../wallet.module';
import { WalletService } from '../infrastructure/services/wallet.service';
import { getDaysInMonth } from '../../../utils';
import { EmployeeTypeEnum } from '../../employee/domain/entities/types';

describe('WalletService', () => {
  let service: WalletService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WalletModule],
      providers: [
        WalletService,
        ConfigService,
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate salary correctly for a full-time employee', () => {
    const baseSalary = 3000;
    const dayOfWorks = 20;
    const currentBalance = 1000;
    const currentDate = new Date();
    const daysInMonth = getDaysInMonth(currentDate);

    const result = service.calculateSalary({
      baseSalary,
      dayOfWorks,
      type: EmployeeTypeEnum.FULL_TIME,
      currentBalance,
    });

    const expectedDailyRate = Math.floor(baseSalary / daysInMonth);
    const expectedSalaryWillGet = expectedDailyRate * dayOfWorks;
    const expectedBalanceAfter = currentBalance + expectedSalaryWillGet;

    expect(result.dailyRate).toEqual(expectedDailyRate);
    expect(result.salaryWillGet).toEqual(expectedSalaryWillGet);
    expect(result.balanceAfter).toEqual(expectedBalanceAfter);
  });

  // Add more test cases for other scenarios if needed
});

// describe('UpdateWalletUsecase', () => {
//   let usecase: UpdateWalletUsecase;
//   let walletService: WalletService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UpdateWalletUsecase,
//         { provide: EmployeeDao, useValue: {} },
//         { provide: WalletService, useValue: {} },
//       ],
//     }).compile();

//     usecase = module.get<UpdateWalletUsecase>(UpdateWalletUsecase);
//     walletService = module.get<WalletService>(WalletService);
//   });

//   it('should be defined', () => {
//     expect(usecase).toBeDefined();
//   });

//   it('should execute update wallet successfully', async () => {
//     const payload = {
//       id: 1,
//       base_salary: 3000,
//       day_of_works: 20,
//       type: 'FULL_TIME',
//       name: 'John Doe',
//       employee_wallet_id: 123,
//       current_balance: 1000,
//     };

//     const salaryDetails = {
//       dailyRate: 100,
//       salaryWillGet: 2000,
//       balanceAfter: 3000,
//     };

//     jest.spyOn(walletService, 'calculateSalary').mockReturnValue(salaryDetails);
//     jest.spyOn(walletService, 'updateWallet').mockResolvedValue();

//     await expect(usecase.execute(payload)).resolves.toEqual(payload);

//     expect(walletService.calculateSalary).toHaveBeenCalledWith({
//       baseSalary: payload.base_salary,
//       dayOfWorks: payload.day_of_works,
//       type: payload.type,
//       currentBalance: payload.current_balance,
//     });

//     expect(walletService.updateWallet).toHaveBeenCalledWith({
//       employeeWallet: expect.any(EmployeeWallet),
//       balanceAfter: salaryDetails.balanceAfter,
//       salaryWillGet: salaryDetails.salaryWillGet,
//       employee: payload,
//     });
//   });

//   it('should throw InternalServerErrorException when updateWallet fails', async () => {
//     const payload = {
//       // payload data
//     };

//     jest.spyOn(walletService, 'calculateSalary').mockReturnValue({});
//     jest.spyOn(walletService, 'updateWallet').mockRejectedValue(new Error());

//     await expect(usecase.execute(payload)).rejects.toThrow(
//       InternalServerErrorException,
//     );
//   });

//   // Add more test cases for other scenarios if needed
// });
