import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { HousekeepingStatus, RoomStatus } from '../entities/room.entity';

export class CreateRoomDto {
  @IsNumber()
  room_num: number;

  @IsNumber()
  floor: number;

  @IsNumber()
  capacity: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  room_price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsEnum(RoomStatus)
  room_status: RoomStatus;

  @IsEnum(HousekeepingStatus)
  housekeeping_status: HousekeepingStatus;
}
