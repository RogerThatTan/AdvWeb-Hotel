import { IsEnum } from 'class-validator';
import { HousekeepingStatus } from '../entities/room.entity';

export class UpdateHousekeepingStatusDto {
  @IsEnum(HousekeepingStatus)
  housekeeping_status: HousekeepingStatus;
}
