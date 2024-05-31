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
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { JobExceptions } from 'src/features/job/exceptions';
import { UpdateWalletUsecase } from '../application/commands';
import {
  EmployeeDao,
  EmployeeDetailDto,
} from 'src/features/employee/infrastructure/daos/employee.dao';

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
    @InjectRepository(JobEntity)
    private _jobRepo: Repository<JobEntity>,
    private _updateWalletUsecase: UpdateWalletUsecase,
    private _employeeDao: EmployeeDao,
  ) {
    this._logger = new Logger(WalletProcessor.name);
  }

  createMessage({ batch }: WalletProcessorJobPayload) {
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
      throw new InternalServerErrorException('Error while saving job');
    }

    let employees: EmployeeDetailDto[];
    try {
      employees = await this._employeeDao.getEmployeeDetails({
        paging,
      });
    } catch (error) {
      console.error(error);
      this._logger.error(error);
      throw new InternalServerErrorException();
    }

    for (const employee of employees) {
      try {
        const executedEmployee =
          await this._updateWalletUsecase.execute(employee);

        savedJob.payload = {
          ...savedJob.payload,
          employee_ids: executedEmployee.id,
        };
        savedJob.status = JobStatusEnum.COMPLETED;
      } catch (err) {
        savedJob.message = err.toString();
        savedJob.status = JobStatusEnum.FAILED;
      }
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
      this._logger.error(err);
      throw new JobExceptions.JobNotFound(savedJobFromProcess.id);
    }

    jobEntity.payload = savedJobFromProcess.payload;
    jobEntity.status = savedJobFromProcess.status;
    jobEntity.message = savedJobFromProcess.message;

    try {
      await this._jobRepo.update(jobEntity.id, jobEntity);
    } catch (err) {
      console.log(err);
      this._logger.error(err);
      throw new InternalServerErrorException('Error while saving job');
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

    jobEntity.message = error.message.toString();
    jobEntity.payload = savedJobFromProcess.payload;
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
