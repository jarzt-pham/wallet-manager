export namespace EmployeeWalletExceptions {
  export class EmployeeWalletNotFound extends Error {
    constructor(employeeId: number) {
      super(`Employee wallet with employeeId ${employeeId} not found`);
    }
  }

  export class EmployeeWalletLogNotFound extends Error {
    constructor(walletId: number) {
      super(`Employee wallet log with walletId ${walletId} not found`);
    }
  }
}
