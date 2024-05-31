import {
  BullModuleOptions,
  BullRootModuleOptions,
  SharedBullAsyncConfiguration,
} from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { JOB_QUEUE } from '../features/job/queue';

export namespace Configuration {
  export const TypeOrmConfiguration: {
    Async: TypeOrmModuleAsyncOptions;
    Default: TypeOrmModuleOptions | undefined;
  } = {
    Async: <TypeOrmModuleAsyncOptions>{
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: configService.get('DATABASE_PORT') || 5432,
        host: configService.get('DATABASE_HOST') || 'localhost',
        username: configService.get('DATABASE_USER') || 'postgres',
        password: configService.get('DATABASE_PASSWORD') || 'password',
        database: configService.get('DATABASE_NAME') || 'salary_hero',
        autoLoadEntities: true,
        synchronize: true,
      }),
    },
    Default: undefined,
  };

  export const BullConfiguration = {
    Async: <SharedBullAsyncConfiguration>{
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('CACHE_HOST') || 'localhost',
          port: configService.get('CACHE_PORT') || 6379,
        },
      }),
    },
    Root: <BullRootModuleOptions>{
      redis: {
        host: 'localhost',
        port: 6379,
      },
    },
    Register: <BullModuleOptions[]>[
      {
        name: JOB_QUEUE.WALLET,
        defaultJobOptions: {
          attempts: 3,
          backoff: 10000,
        },
      },
      {
        name: JOB_QUEUE.WALLET_LOG,
        defaultJobOptions: {
          attempts: 3,
          backoff: 10000,
        },
      },
    ],
  };
}
