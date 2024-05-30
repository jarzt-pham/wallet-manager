import { Injectable } from '@nestjs/common';
import { Job as BullJob } from 'bull';
import { ConfigService } from '@nestjs/config';
import { BullMQMessageQueue } from './instances/bull.instance';
import { Job } from 'src/features/job/domain/entities/job.entity';

export type JobMQType = BullJob;

export interface IMessageQueue<MessageType, JobEntity> {
  pushMessage(topic: string, message: MessageType): Promise<void>;
  consumeMessages(
    topic: string,
    callback: (message: MessageType) => Promise<void>,
  ): Promise<void>;
  onCompleted(
    job: JobEntity,
    callback: (job: JobEntity, message: MessageType) => Promise<void>,
  ): Promise<void>;
  onFailed(
    job: JobEntity,
    callback: (
      job: JobEntity,
      message: MessageType,
      error: Error,
    ) => Promise<void>,
  ): Promise<void>;
}

export class MessageQueue<MessageType, JobEntity>
  implements IMessageQueue<MessageType, JobEntity>
{
  constructor() {}

  async pushMessage(topic: string, message: MessageType): Promise<void> {}

  async consumeMessages(
    topic: string,
    callback: (message: MessageType) => Promise<void>,
  ): Promise<void> {}
  async onCompleted(
    job: JobEntity,
    callback: (job: JobEntity, message: MessageType) => Promise<void>,
  ): Promise<void> {}
  async onFailed(
    job: JobEntity,
    callback: (
      job: JobEntity,
      message: MessageType,
      error: Error,
    ) => Promise<void>,
  ): Promise<void> {}
}

export interface IMessageQueueManager<MessageType, JobEntity> {
  pushMessage(topic: string, message: MessageType): Promise<void>;
  consumeMessages(
    topic: string,
    callback: (message: MessageType) => Promise<void>,
  ): Promise<void>;
  onCompleted(
    job: JobEntity,
    callback: (job: JobEntity, message: MessageType) => Promise<void>,
  ): Promise<void>;
  onFailed(
    jobEntity: JobEntity,
    callback: (
      job: JobEntity,
      message: MessageType,
      error: Error,
    ) => Promise<void>,
  ): Promise<void>;
}

//use this class to manage the message queue and deployment of the message queue in the application
@Injectable()
export class MessageQueueManager<MessageType, JobEntity>
  implements IMessageQueueManager<MessageType, JobEntity>
{
  private messageQueueInstanceName: string;

  private queueMap: Map<string, MessageQueue<MessageType, JobEntity>> =
    new Map();

  constructor(
    private messageQueue: MessageQueue<MessageType, JobEntity>,
    private configService: ConfigService,
  ) {
    this.messageQueueInstanceName =
      this.configService.get<string>('MESSAGE_QUEUE') || 'bullmq';
  }

  registryQueue(queueName: string) {
    return this.useMessageQueue(queueName);
  }

  getQueueInstance(queueName: string) {
    return this.queueMap.get(queueName);
  }

  //factory pattern to create the message queue instance
  //based on the configuration
  //easy to scale and change the message queue instance
  useMessageQueue(queueName: string) {
    switch (this.messageQueueInstanceName) {
      default:
      case 'bullmq':
        this.messageQueue = new BullMQMessageQueue<MessageType, JobEntity>(
          queueName,
        );
        this.queueMap.set(queueName, this.messageQueue);
        break;
    }
  }

  async pushMessage(topic: string, message: MessageType): Promise<void> {
    await this.messageQueue.pushMessage(topic, message);
  }

  async consumeMessages(
    topic: string,
    callback: (message: MessageType) => Promise<void>,
  ): Promise<void> {
    return this.messageQueue.consumeMessages(topic, callback);
  }

  async onCompleted(
    jobEntity: JobEntity,
    callback: (job: JobEntity, message: MessageType) => Promise<void>,
  ): Promise<void> {
    await this.messageQueue.onCompleted(jobEntity, callback);
  }

  async onFailed(
    jobEntity: JobEntity,
    callback: (
      job: JobEntity,
      message: MessageType,
      error: Error,
    ) => Promise<void>,
  ): Promise<void> {
    await this.messageQueue.onFailed(jobEntity, callback);
  }
}
