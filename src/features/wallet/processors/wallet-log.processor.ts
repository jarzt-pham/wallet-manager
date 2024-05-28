import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JOB_QUEUE } from 'src/features/job/queue';
import { EmployeeWalletLog } from '../domain/entities/employee-wallet-log.entity';
import { EmployeeWallet } from '../domain/entities/employee-wallet.entity';
import { Job as JobEntity } from 'src/features/job/domain/entities/job.entity';
import { Logger } from '@nestjs/common';
import {
  JobStatusEnum,
  JobTypeEnum,
} from 'src/features/job/domain/entities/types/job.type';

export type WalletLogProcessorJobPayload = {
  previousBalance: number;
  newBalance: number;
  amountChanged: number;
  description: string;
  employeeWallet: EmployeeWallet;
};

@Processor(JOB_QUEUE.WALLET_LOG)
export class WalletLogProcessor {
  private _logger: Logger;
  private JOB_TYPE = JobTypeEnum.CREATE_WALLET_LOG;

  constructor(
    private readonly _dataSource: DataSource,
    @InjectRepository(EmployeeWalletLog)
    private walletLogRepository: Repository<EmployeeWalletLog>,
    @InjectRepository(JobEntity)
    private _jobRepo: Repository<JobEntity>,
  ) {
    this._logger = new Logger(WalletLogProcessor.name);
  }

  createMessage({ employeeWallet }: WalletLogProcessorJobPayload) {
    return `${this.JOB_TYPE}: Processing wallet log job with wallet id ${employeeWallet.id}`;
  }

  @Process()
  async handleWalletLog(
    job: Job<{
      previousBalance: number;
      newBalance: number;
      amountChanged: number;
      description: string;
      employeeWallet: EmployeeWallet;
    }>,
  ) {
    this._logger.log(this.createMessage(job.data));

    const {
      amountChanged,
      description,
      newBalance,
      previousBalance,
      employeeWallet,
    } = job.data;

    const entity = new JobEntity();
    entity.create({
      type: this.JOB_TYPE,
      status: JobStatusEnum.PROCESSING,
      payload: job.data,
    });

    let savedJob: JobEntity;
    try {
      savedJob = await this._jobRepo.save(entity);
    } catch (err) {
      console.error(err);
      this._logger.error(err);
      throw new Error('Error while saving job');
    }

    const walletLog = new EmployeeWalletLog();
    walletLog.create({
      amountChanged,
      description,
      newBalance,
      previousBalance,
      employeeWallet,
    });

    try {
      const wallet = await this.walletLogRepository.save(walletLog);

      savedJob.payload = { ...savedJob.payload, wallet };
      savedJob.status = JobStatusEnum.COMPLETED;
    } catch (error) {
      this._logger.error(error);
      savedJob.message = error.toString();
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
    } catch (error) {
      console.log(error);
      this._logger.error(error);
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
    } catch (error) {
      console.log(error);
      this._logger.error(error);
    }

    if (jobEntity) {
      jobEntity.message = error.message.toString();
      jobEntity.payload = savedJobFromProcess.payload;
      jobEntity.status = JobStatusEnum.FAILED;

      await this._jobRepo.update(jobEntity.id, jobEntity);
    }
  }
}
