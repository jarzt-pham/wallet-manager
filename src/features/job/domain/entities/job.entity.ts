import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { JOB_TABLE } from '../../infrastructure';
import { CreateJobPayload } from './types/job.type';
import { generateUUID } from '../../../../utils';

@Entity({
  name: JOB_TABLE.NAME,
})
export class Job {
  @Column({
    name: JOB_TABLE.COLUMNS.ID.NAME,
    type: 'uuid',
    primary: true,
  })
  id: string;

  @Column({
    name: JOB_TABLE.COLUMNS.STATUS.NAME,
  })
  status: string;

  @Column({
    name: JOB_TABLE.COLUMNS.TYPE.NAME,
  })
  type: string;

  @Column({
    name: JOB_TABLE.COLUMNS.PAYLOAD.NAME,
    type: 'jsonb',
  })
  payload: any;

  @Column({
    name: JOB_TABLE.COLUMNS.MESSAGE.NAME,
  })
  message: string;

  @CreateDateColumn({
    name: JOB_TABLE.COLUMNS.CREATED_AT.NAME,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: JOB_TABLE.COLUMNS.UPDATED_AT.NAME,
  })
  updatedAt: Date;

  create(payload: CreateJobPayload) {
    this.id = generateUUID();
    this.status = payload.status;
    this.type = payload.type;
    this.payload = payload?.payload ? payload.payload : {};
    this.message = payload?.message ? payload.message : '';
    this.createdAt = new Date();
  }
}
