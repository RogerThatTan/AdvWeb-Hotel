import {
  HttpException,
  HttpStatus,
  Injectable,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateReservationDto } from './dtos/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Rooms, RoomStatus } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { CouponService } from 'src/coupon/coupon.service';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,

    public readonly userService: UserService,
    public readonly couponService: CouponService,
    public readonly roomService: RoomService,
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

    // update in room table -> reservation_id
  }
}
