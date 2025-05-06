import {
  HttpException,
  HttpStatus,
  Injectable,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateReservationDto } from './dtos/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, TypeOfBooking } from './entities/reservation.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Rooms, RoomStatus } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { CouponService } from 'src/coupon/coupon.service';
import { RoomService } from 'src/room/room.service';
import { Booking, PaymentStatus } from 'src/booking/entities/booking.entity';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    public readonly userService: UserService,
    public readonly couponService: CouponService,
    public readonly roomService: RoomService,
    // public readonly bookingService: BookingService,
  ) {}

  async createReservation(createReservationDto: CreateReservationDto) {
    const {
      checkin_date,
      checkout_date,
      number_of_guests,
      typeOfBooking,
      no_of_rooms,
      phone,
      room_num,
      coupon_code,
    } = createReservationDto;

    let user = await this.userRepository.findOne({ where: { phone: phone } });
    if (!user) {
      user = this.userRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'StrongP@ssw0rd!',
        phone: phone,
        address: '123 Main Street, Dhaka, Bangladesh',
        nid: phone,
        passport: phone,
        nationality: 'Bangladeshi',
        Profession: 'Software Engineer',
        age: 30,
        maritalStatus: true,
        vehicleNo: phone,
        fatherName: 'Robert Doe',
        registrationDate: new Date('2025-05-03T00:00:00.000Z'),
        role: 'guest',
      });
      await this.userRepository.save(user);
    }

    const allRooms = await Promise.all(
      room_num.map((room) =>
        this.roomRepository.findOne({ where: { room_num: room } }),
      ),
    );

    allRooms.forEach((room, index) => {
      if (!room) {
        throw new Error(`Room with number ${room_num[index]} not found.`);
      }
      if (
        room.room_status === RoomStatus.OCCUPIED ||
        room.room_status === RoomStatus.MAINTENANCE ||
        room.room_status === RoomStatus.RESERVED
      ) {
        throw new HttpException(
          `Room with number ${room.room_num} is already occupied or under maintenance or reserved.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    const timeDifference = checkout_date.getTime() - checkin_date.getTime();

    const numberOfDays = timeDifference / (1000 * 3600 * 24); // 1000 ms * 3600 s * 24 hours

    let totalPrice = 0;
    allRooms.forEach((room) => {
      if (room?.room_price) {
        totalPrice += Math.round(room.room_price);
      }
    });

    totalPrice = Math.round(totalPrice * numberOfDays);
    let couponDiscount = 0;
    if (coupon_code) {
      const coupon = await this.couponService.getCouponByCode(coupon_code);
      if (!coupon) {
        throw new HttpException(
          `Coupon with code ${coupon_code} not found.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (coupon?.is_active === false || coupon?.quantity === 0) {
        throw new HttpException(
          `Coupon with code ${coupon_code} is expired.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      couponDiscount = Math.round((totalPrice * coupon?.coupon_percent) / 100);
      coupon.quantity -= 1;
      await this.couponService.updateCoupon(
        coupon.coupon_code,
        coupon.coupon_id,
      );
    }

    const reservation = {
      checkin_date,
      checkout_date,
      number_of_guests,
      total_price:
        couponDiscount == 0 ? totalPrice : totalPrice - couponDiscount,
      room_price: totalPrice,
      discount_price: couponDiscount,
      coupon_code: coupon_code,
      typeOfBooking,
      no_of_rooms,
      phone,
      user_id: user?.user_id,
      room_details: allRooms,
    };

    const newReservation = this.reservationRepository.create(reservation);

    const reservationFromDB =
      await this.reservationRepository.save(newReservation);

    const sendBack = {
      ...reservation,
      coupon_discount: couponDiscount,
      totalPrice: totalPrice,
    };

    allRooms.forEach(async (room) => {
      if (room?.room_num) {
        await this.roomService.updateReservationId(
          room.room_num,
          reservationFromDB,
        );
      }
    });

    return sendBack;
  }
  async getReservations(reservationId: number) {
    return await this.reservationRepository.findOne({
      where: { reservation_id: reservationId },
    });
  }

  async confirmReservation(reservationId: number) {
    const reservation = await this.getReservations(reservationId);

    if (!reservation) {
      throw new HttpException(
        `Reservation with ID ${reservationId} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const couponCode = reservation.coupon_code;
    var coupon;
    if (couponCode) {
      coupon = await this.couponService.getCouponByCode(couponCode);
    }

    const booking = this.bookingRepository.create({
      checkin_date: reservation.checkin_date,
      checkout_date: reservation.checkout_date,
      number_of_guests: reservation.number_of_guests,
      room_price: reservation.room_price,
      coupon_percent: coupon?.coupon_percent,
      total_price: reservation.total_price,
      payment_status: PaymentStatus.PENDING,
      booking_date: new Date(),
      typeOfBooking: reservation.typeOfBooking as TypeOfBooking,
      no_of_rooms: reservation.no_of_rooms,
      user_phone: reservation.phone,
      coupon: coupon ? coupon : null,
    });
    const savedBooking = await this.bookingRepository.save(booking);

    const data = await this.roomService.confirmReservation(
      reservation.reservation_id,
      booking,
    );

    return data;
  }
}
