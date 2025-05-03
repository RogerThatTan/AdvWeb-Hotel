import { Module } from '@nestjs/common';
import { HousekeepingController } from './housekeeping.controller';
import { HousekeepingService } from './housekeeping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousekeepingHistory } from './entities/housekeeping-history.entity';
import { RoomModule } from '../room/room.module';
import { BookingModule } from '../booking/booking.module';
import { ManagementModule } from '../management/management.module';

@Module({
  controllers: [HousekeepingController],
  providers: [HousekeepingService],
  imports: [TypeOrmModule.forFeature([HousekeepingHistory]),RoomModule,BookingModule,ManagementModule,],
})
export class HousekeepingModule {}
