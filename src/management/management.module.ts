import { Module } from '@nestjs/common';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Management } from './entities/management.entity';

@Module({
  controllers: [ManagementController],
  providers: [ManagementService],
  imports: [TypeOrmModule.forFeature([Employee, Management])],
  exports: [TypeOrmModule],
})
export class ManagementModule {}
