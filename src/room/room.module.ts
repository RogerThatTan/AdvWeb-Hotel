import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomItem } from './entities/room-item.entity';
import { Rooms } from './entities/room.entity';
import { ManagementModule } from '../management/management.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [TypeOrmModule.forFeature([RoomItem, Rooms]),ManagementModule],
})
export class RoomModule {}
