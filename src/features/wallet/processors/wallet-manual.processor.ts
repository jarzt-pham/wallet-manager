import { WalletService } from '../infrastructure/services/wallet.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Job,
  Job as JobEntity,
} from 'src/features/job/domain/entities/job.entity';
import { Repository } from 'typeorm';
import {
  JobStatusEnum,
  JobTypeEnum,
} from 'src/features/job/domain/entities/types/job.type';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JobExceptions } from 'src/features/job/exceptions';
import {
  IMessageQueue,
  MessageQueueManager,
} from 'src/message-queue/message-queue';
import { JOB_QUEUE } from 'src/features/job/queue';
import { IProcessor } from 'src/message-queue/processors';

export type WalletProcessorJobPayload = {
  batch: number;
  paging: {
    limit: number;
    offset: number;
  };
};

@Injectable()
export class WalletProcessor implements IProcessor {
  JOB_QUEUE_NAME = JOB_QUEUE.WALLET;
  JOB_TYPE = JobTypeEnum.UPDATE_WALLET;
  private _logger: Logger;

  private _mq: IMessageQueue<WalletProcessorJobPayload, Job>;

  constructor(
    private _walletService: WalletService,

    @InjectRepository(JobEntity)
    private _jobRepo: Repository<JobEntity>,
    private readonly _messageQueueManager: MessageQueueManager<
      WalletProcessorJobPayload,
      Job
    >,
  ) {
    this._logger = new Logger(WalletProcessor.name);
    this._mq = this._messageQueueManager.getQueueInstance(this.JOB_QUEUE_NAME);
    this.consume(this.JOB_QUEUE_NAME);
  }

  createMessage({ batch }: WalletProcessorJobPayload) {
    return `${this.JOB_TYPE}: Processing wallet job with batch ${batch}`;
  }

  async consume(queueName: string) {
    await this._mq.consumeMessages(queueName, async (message) =>
      this.handleProcessingJob(message),
    );
  }
  async handleProcessingJob(message: WalletProcessorJobPayload) {
    const { batch, paging } = message;

    this._logger.log(this.createMessage(message));

    const entity = new JobEntity();
    entity.create({
      type: this.JOB_TYPE,
      status: JobStatusEnum.PROCESSING,
      payload: { batch, paging },
    });

    let savedJob: JobEntity;
    try {
      savedJob = await this._jobRepo.save(entity);
    } catch (err) {
      console.error(err);
      this._logger.error(err);
      throw new InternalServerErrorException('Error while saving job');
    }

    try {
      const employeeIds =
        await this._walletService.calculateAndUpdateByBatch(batch);

      savedJob.payload = { ...savedJob.payload, employee_ids: employeeIds };
      savedJob.status = JobStatusEnum.COMPLETED;
    } catch (err) {
      savedJob.message = err.toString();
      savedJob.status = JobStatusEnum.FAILED;
    }

    //listen to the completed event
    await this._messageQueueManager.onCompleted(savedJob, (job, message) =>
      this.handleCompletedJob(job, message),
    );
    //listen to the failed event
    await this._messageQueueManager.onFailed(savedJob, (job, message, error) =>
      this.handleFailedJob(job, message, error),
    );
  }

  async handleCompletedJob(
    savedJob: JobEntity,
    message: WalletProcessorJobPayload,
  ) {
    let jobEntity: JobEntity;
    try {
      jobEntity = await this._jobRepo.findOne({
        where: { id: savedJob.id },
      });
    } catch (err) {
      console.log(err);
      this._logger.error(err);
      throw new JobExceptions.JobNotFound(savedJob.id as any);
    }

    jobEntity.payload = savedJob?.payload;
    jobEntity.status = savedJob?.status;
    jobEntity.message = savedJob?.message;

    try {
      await this._jobRepo.update(jobEntity.id, jobEntity);
    } catch (err) {
      console.log(err);
      this._logger.error(err);
      throw new InternalServerErrorException('Error while saving job');
    }
  }

  async handleFailedJob(
    savedJob: JobEntity,
    message: WalletProcessorJobPayload,
    error: Error,
  ) {
    let jobEntity: JobEntity;
    try {
      jobEntity = await this._jobRepo.findOne({
        where: { id: savedJob.id },
      });
    } catch (err) {
      console.log(err);
    }

    jobEntity.message = error.message.toString();
    jobEntity.payload = savedJob.payload;
    jobEntity.status = JobStatusEnum.FAILED;

    try {
      await this._jobRepo.update(jobEntity.id, jobEntity);
    } catch (err) {
      console.log(err);
      this._logger.error(err);
      throw new InternalServerErrorException('Error while saving job');
    }
  }
}
