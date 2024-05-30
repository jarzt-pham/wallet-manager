export interface IProcessor {
  JOB_TYPE: string;
  JOB_QUEUE_NAME: string;

  createMessage(payload: any): string;
  consume(queueName: string): Promise<void>;
}
