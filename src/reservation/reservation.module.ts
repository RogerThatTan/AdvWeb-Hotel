import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { CouponService } from 'src/coupon/coupon.service';
import { CouponModule } from 'src/coupon/coupon.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [TypeOrmModule.forFeature([Reservation]), UserModule, RoomModule, CouponModule],
  exports: [ReservationService],
})
export class ReservationModule {}
