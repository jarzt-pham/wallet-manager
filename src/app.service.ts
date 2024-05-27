import { Injectable, OnModuleInit } from '@nestjs/common';
import { initDataForEmployee } from './infrastructure';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly _dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit() {
    initDataForEmployee(this._dataSource);
  }
}
