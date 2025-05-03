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
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, {
    message: 'Coupon code must be shorter than or equal to 50 characters',
  })
  coupon_code: string;

  @IsNumber(
    {},
    {
      message: 'Discount percentage must be a number between 0.01-100',
    },
  )
  @Min(0.01)
  @Max(100)
  coupon_percent: number;

  @IsBoolean()
  is_active: boolean;

  @IsInt()
  @IsNotEmpty()
  employee_id: number;
}
