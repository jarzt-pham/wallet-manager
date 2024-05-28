import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './domain/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class JobModule {}
