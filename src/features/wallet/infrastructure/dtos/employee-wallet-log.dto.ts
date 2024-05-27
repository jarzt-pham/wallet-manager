export type EmployeeWalletLogDTO = {
  id: number;
  previous_ballance: number;
  new_ballance: number;
  amount_changed: number;
  description: string;
  wallet_id: number;
  created_at: Date;
};
