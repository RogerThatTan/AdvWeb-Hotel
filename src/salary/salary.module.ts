import { Module } from '@nestjs/common';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from './entities/salary.entity';
import { SalaryHistory } from './entities/salary-history.entity';
import { ManagementModule } from '../management/management.module';

@Module({
  controllers: [SalaryController],
  providers: [SalaryService],
  imports: [TypeOrmModule.forFeature([Salary, SalaryHistory]), ManagementModule],
})
export class SalaryModule {}
