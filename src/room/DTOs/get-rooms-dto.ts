import { IntersectionType } from '@nestjs/mapped-types';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/DTOs/pagination-query.dto';

class GetRoomsBaseDto {
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetRoomsDto extends IntersectionType(
  GetRoomsBaseDto,
  PaginationQueryDto,
) {}
