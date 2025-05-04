import { Transform } from 'class-transformer';
import {
  IsString,
  IsDecimal,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  IsNumber,
  IsDate,
  Matches,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  coupon_code: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  coupon_percent: number;

  @IsInt()
  @IsNotEmpty()
  employee_id: number;

  @IsDate()
  @Transform(({ value }) => new Date(value)) // Add proper transformation
  expire_at: Date;
}
