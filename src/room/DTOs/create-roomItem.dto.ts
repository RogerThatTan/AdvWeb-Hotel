import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsISO8601,
} from 'class-validator';
import { ItemStatus } from '../entities/room-item.entity';

export class CreateRoomItemDto {
  @IsString()
  item_name: string;

  @IsEnum(ItemStatus)
  status: ItemStatus;

  @IsISO8601()
  last_checked: Date;

  @IsOptional()
  @IsString()
  issue_report?: string;

  @IsNumber()
  room_num: number;

  @IsNumber()
  employee_id: number;
}
