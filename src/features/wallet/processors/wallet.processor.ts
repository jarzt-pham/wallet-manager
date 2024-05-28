import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { JOB_QUEUE } from '../../job/queue';
import { WalletService } from '../infrastructure/services/wallet.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Job as JobEntity } from 'src/features/job/domain/entities/job.entity';
import { Repository } from 'typeorm';
import {
  JobStatusEnum,
  JobTypeEnum,
} from 'src/features/job/domain/entities/types/job.type';
import { Logger } from '@nestjs/common';

export type WalletProcessorJobPayload = {
  batch: number;
  paging: {
    limit: number;
    offset: number;
  };
};

@Processor(JOB_QUEUE.WALLET)
export class WalletProcessor {
  private JOB_TYPE = JobTypeEnum.UPDATE_WALLET;
  private _logger: Logger;

  constructor(
    private _walletService: WalletService,

    @InjectRepository(JobEntity)
    private _jobRepo: Repository<JobEntity>,
  ) {
    this._logger = new Logger(WalletProcessor.name);
  }

  createMessage({ batch, paging }: WalletProcessorJobPayload) {
    return `${this.JOB_TYPE}: Processing wallet job with batch ${batch}`;
  }

  @Process()
  async handleBalanceCalculation(job: Job<WalletProcessorJobPayload>) {
    const { batch, paging } = job.data;
    
    this._logger.log(this.createMessage(job.data));

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
      throw new Error('Error while saving job');
    }

    try {
      const employeeIds =
        await this._walletService.calculateAndUpdateBatch(batch);

      savedJob.payload = { ...savedJob.payload, employee_ids: employeeIds };
      savedJob.status = JobStatusEnum.COMPLETED;
    } catch (err) {
      savedJob.message = err.toString();
      savedJob.status = JobStatusEnum.FAILED;
    }

    return savedJob;
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    const savedJobFromProcess = job.returnvalue;

    let jobEntity: JobEntity;
    try {
      jobEntity = await this._jobRepo.findOne({
        where: { id: savedJobFromProcess.id },
      });
    } catch (err) {
      console.log(err);
    }

    if (jobEntity) {
      jobEntity.payload = savedJobFromProcess.payload;
      jobEntity.status = savedJobFromProcess.status;
      jobEntity.message = savedJobFromProcess.message;

      await this._jobRepo.update(jobEntity.id, jobEntity);
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    const savedJobFromProcess = job.returnvalue;

    let jobEntity: JobEntity;
    try {
      jobEntity = await this._jobRepo.findOne({
        where: { id: savedJobFromProcess.id },
      });
    } catch (err) {
      console.log(err);
    }

    if (jobEntity) {
      jobEntity.message = error.message.toString();
      jobEntity.payload = savedJobFromProcess.payload;
      jobEntity.status = JobStatusEnum.FAILED;

      await this._jobRepo.update(jobEntity.id, jobEntity);
    }
  }
}
