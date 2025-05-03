import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ItemStatus } from '../entities/room-item.entity';

export class ReportItemIssueDto {
  @IsString()
  @IsNotEmpty()
  issue_report: string;

  @IsEnum(ItemStatus)
  status: ItemStatus;
}
