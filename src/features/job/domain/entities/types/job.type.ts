export enum JobStatusEnum {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PROCESSING = 'PROCESSING',
}

export enum JobTypeEnum {
  UPDATE_WALLET = 'UPDATE_WALLET',
  CREATE_WALLET_LOG = 'CREATE_WALLET_LOG',
}

export type CreateJobPayload = {
  status: JobStatusEnum;
  type: JobTypeEnum;
  payload?: any;
  message?: string;
};
