import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/update-balance')
  async updateBalance(): Promise<string> {
    await this.appService.scheduleDailyCalculateAndUpdateBalance();
    return 'update balance';
  }
}
