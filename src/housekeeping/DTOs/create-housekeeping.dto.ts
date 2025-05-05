import { IsDateString, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ServiceType } from '../entities/housekeeping-history.entity';

export class CreateHousekeepingDto {
  @IsDateString()
  date: string;

  @IsEnum(ServiceType)
  type_of_service: ServiceType;

  @IsOptional()
  @IsString()
  issue_report?: string;

  @IsOptional()
  @IsString()
  cleaner_feedback?: string;

  @IsNumber()
  room: number;

  @IsNumber()
  cleaned_by: number;

  @IsNumber()
  supervisor: number;

  @IsOptional()
  @IsNumber()
  booking?: number;
}
