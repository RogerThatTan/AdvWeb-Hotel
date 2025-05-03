import { IsEnum } from 'class-validator';
import { RoomStatus } from '../entities/room.entity';

export class UpdateRoomStatusDto {
  @IsEnum(RoomStatus)
  room_status: RoomStatus;
}
