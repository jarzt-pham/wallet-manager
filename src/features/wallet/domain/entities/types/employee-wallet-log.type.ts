import { EmployeeWallet } from "../employee-wallet.entity";

export type CreateEmployeeWalletLogPayload = {
  previousBalance: number;
  newBalance: number;
  amountChanged: number;
  description: string;
  employeeWallet: EmployeeWallet;
};
