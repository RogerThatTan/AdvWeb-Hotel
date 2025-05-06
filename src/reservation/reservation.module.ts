import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { CouponService } from 'src/coupon/coupon.service';
import { CouponModule } from 'src/coupon/coupon.module';
import { BookingModule } from 'src/booking/booking.module';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UserModule,
    RoomModule,
    CouponModule,
    BookingModule,
    PdfModule,
  ],
  exports: [ReservationService],
})
export class ReservationModule {}
