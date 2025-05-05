import { IsDateString, IsInt, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PaymentStatus, TypeOfBooking } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsDateString()
  checkin_date: string;

  @IsDateString()
  checkout_date: string;

  @IsInt()
  number_of_guests: number;

  @IsNumber()
  room_price: number;

  @IsOptional()
  @IsNumber()
  coupon_percent?: number;

  @IsNumber()
  total_price: number;

  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;

  @IsEnum(TypeOfBooking)
  typeOfBooking: TypeOfBooking;

  @IsBoolean()
  service_asked: boolean;

  @IsInt()
  no_of_rooms: number;

  @IsInt()
  user_id: number;

  @IsOptional()
  @IsInt()
  coupon_id?: number;

  @IsOptional()
  @IsInt()
  employee_id?: number;
}
