import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TypeOfBooking } from '../entities/reservation.entity';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkin_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkout_date: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  number_of_guests: number;

  @IsEnum(TypeOfBooking)
  typeOfBooking: TypeOfBooking;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  no_of_rooms: number;

  @IsNotEmpty({ each: true })
  room_num: number[];

  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phone: string;

  @IsOptional()
  coupon_code?: string;

}
