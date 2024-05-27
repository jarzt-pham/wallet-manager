export const EMPLOYEE_WALLET_TABLE = Object.freeze({
  NAME: 'employee_wallets',
  COLUMNS: {
    ID: {
      NAME: 'id',
    },
    BALANCE: {
      NAME: 'balance',
    },
    EMPLOYEE_ID: {
      NAME: 'employee_id',
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
    UPDATED_AT: {
      NAME: 'updated_at',
    },
  },
});

export const EMPLOYEE_WALLET_LOG_TABLE = Object.freeze({
  NAME: 'employee_wallet_logs',
  COLUMNS: {
    ID: {
      NAME: 'id',
    },
    PREVIOUS_BALANCE: {
      NAME: 'previous_balance',
    },
    NEW_BALANCE: {
      NAME: 'new_balance',
    },
    AMOUNT_CHANGED: {
      NAME: 'amount_changed',
    },
    WALLET_ID: {
      NAME: 'wallet_id',
    },
    DESCRIPTION: {
      NAME: 'description',
    },
    CREATED_AT: {
      NAME: 'created_at',
    },
  },
});
