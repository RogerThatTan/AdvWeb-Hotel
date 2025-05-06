import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsPhoneNumber,
  IsNotEmpty,
  IsDate,
  IsArray,
} from 'class-validator';
import { PaymentStatus, TypeOfBooking } from '../entities/booking.entity';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsDate()
  @Type(() => Date)
  checkin_date: Date;

  @IsDate()
  @Type(() => Date)
  checkout_date: Date;

  @IsInt()
  number_of_guests: number;

  @IsOptional()
  @IsNumber()
  coupon_percent?: number;

  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;

  @IsEnum(TypeOfBooking)
  typeOfBooking: TypeOfBooking;

  @IsInt()
  no_of_rooms: number;

  @IsArray()
  @IsInt({ each: true })
  room_num: number[];

  @IsOptional()
  coupon_code?: string;

  @IsOptional()
  @IsInt()
  employee_id?: number;

  @IsPhoneNumber('BD')
  @IsNotEmpty()
  user_phone: string;
}
