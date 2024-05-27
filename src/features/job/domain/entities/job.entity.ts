import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { JOB_TABLE } from '../../infrastructure';

@Entity({
  name: JOB_TABLE.NAME,
})
export class Job {
  @Column({
    name: JOB_TABLE.COLUMNS.ID.NAME,
    type: 'uuid',
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
}
