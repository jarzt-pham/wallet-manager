import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

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
        username: configService.get('DATABASE_USER') || 'postgres',
        password: configService.get('DATABASE_PASSWORD') || 'password',
        database: configService.get('DATABASE_NAME') || 'salary_hero',
        autoLoadEntities: true,
        synchronize: true,
      }),
    },
    Default: undefined,
  };
}
