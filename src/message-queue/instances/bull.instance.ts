import { Injectable } from '@nestjs/common';
import { IMessageQueue, MessageQueue } from '../message-queue';
import { Queue, Worker, QueueOptions } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { WalletService } from 'src/features/wallet/infrastructure/services/wallet.service';
import { Job } from 'src/features/job/domain/entities/job.entity';
import { Job as BullJob } from 'bullmq';

@Injectable()
export class BullMQMessageQueue<MessageType, JobEntity>
  implements IMessageQueue<MessageType, JobEntity>
{
  private bullQueue: Queue;
  private bullWorker: Worker;
  private configService: ConfigService;
  private config: QueueOptions;

  constructor(queueName: string) {
    this.configService = new ConfigService();

    this.config = {
      connection: {
        host: this.configService.get('CACHE_HOST') || 'localhost',
        port: this.configService.get('CACHE_PORT') || 6379,
      },
    };

    this.bullQueue = new Queue(queueName, this.config);
  }

  getWorkerInstance() {
    return this.bullWorker;
  }

  async pushMessage(topic: string, message: MessageType): Promise<void> {
    await this.bullQueue.add(topic, message);
  }

  async consumeMessages(
    queueName: string,
    callback: (message: MessageType) => Promise<void>,
  ) {
    this.bullWorker = new Worker(
      queueName,
      async (job) => {
        await callback(job.data);
      },
      this.config,
    );
  }

  async onCompleted(
    job: JobEntity,
    callback: (jobEntity: JobEntity, message: MessageType) => Promise<void>,
  ): Promise<void> {
    this.bullWorker.on('completed', async (bullJob: BullJob) => {
      await callback(job, bullJob.data);
    });
  }

  async onFailed(
    job: JobEntity,
    callback: (
      jobEntity: JobEntity,
      message: MessageType,
      error: Error,
    ) => Promise<void>,
  ): Promise<void> {
    this.bullWorker.on('failed', async (bullJob: BullJob, error: Error) => {
      await callback(job, bullJob.data, error);
    });
  }
}
