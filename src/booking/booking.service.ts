import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Booking,
  PaymentStatus,
  TypeOfBooking,
} from './entities/booking.entity';
import { Accounts, PaymentType } from './entities/accounts.entity';
import { CreateBookingDto } from './DTOs/create-booking.dto';
import { Coupon } from '../coupon/entities/coupon.entity'; // Import Coupon entity
import { CouponUsage } from '../coupon/entities/coupon-usage.entity'; // Import CouponUsage entity
import { CouponService } from 'src/coupon/coupon.service';
import { RoomService } from 'src/room/room.service';
import { Rooms, RoomStatus } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Accounts)
    private accountsRepo: Repository<Accounts>,
    @InjectRepository(Coupon)
    private couponRepo: Repository<Coupon>, // Inject Coupon repo
    @InjectRepository(CouponUsage)
    private couponUsageRepo: Repository<CouponUsage>, // Inject CouponUsage repo

    private readonly couponService: CouponService, // Inject CouponService

    private readonly roomService: RoomService,
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    public readonly userService: UserService,
  ) {}

  async createBooking(dto: CreateBookingDto) {
    const allRooms = await Promise.all(
      dto.room_num.map((room) =>
        this.roomRepository.findOne({ where: { room_num: room } }),
      ),
    );

    allRooms.forEach((room, index) => {
      if (!room) {
        throw new Error(`Room with number ${dto.room_num[index]} not found.`);
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

    const timeDifference =
      dto.checkout_date.getTime() - dto.checkin_date.getTime();

    const numberOfDays = timeDifference / (1000 * 3600 * 24); // 1000 ms * 3600 s * 24 hours

    let totalPrice = 0;
    allRooms.forEach((room) => {
      if (room?.room_price) {
        totalPrice += Math.round(room.room_price);
      }
    });

    totalPrice = Math.round(totalPrice);

    totalPrice = Math.round(totalPrice * numberOfDays);
    let couponDiscount = 0;

    var mainCoupon = 0;
    var couponCode;
    if (dto.coupon_code) {
      const coupon = await this.couponService.getCouponByCode(dto.coupon_code);

      if (!coupon) {
        throw new HttpException(
          `Coupon with code ${dto.coupon_code} not found.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (coupon?.is_active === false || coupon?.quantity === 0) {
        throw new HttpException(
          `Coupon with code ${dto.coupon_code} is expired.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      couponCode = coupon;
      mainCoupon = coupon.coupon_percent;
      couponDiscount = Math.round((totalPrice * coupon?.coupon_percent) / 100);

      await this.couponService.updateCoupon(
        coupon.coupon_code,
        coupon.coupon_id,
      );
    }

    let user = await this.userRepository.findOne({
      where: { phone: dto.user_phone },
    });
    if (!user) {
      user = this.userRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'StrongP@ssw0rd!',
        phone: dto.user_phone,
        address: '123 Main Street, Dhaka, Bangladesh',
        nid: dto.user_phone,
        passport: dto.user_phone,
        nationality: 'Bangladeshi',
        Profession: 'Software Engineer',
        age: 30,
        maritalStatus: true,
        vehicleNo: dto.user_phone,
        fatherName: 'Robert Doe',
        registrationDate: new Date('2025-05-03T00:00:00.000Z'),
        role: 'guest',
      });
      await this.userRepository.save(user);
    }

    // Create a new booking entry
    const booking = this.bookingRepo.create({
      checkin_date: dto.checkin_date,
      checkout_date: dto.checkout_date,
      number_of_guests: dto.number_of_guests,
      room_price: totalPrice,
      coupon_percent: mainCoupon,
      total_price:
        couponDiscount == 0 ? totalPrice : totalPrice - couponDiscount,
      payment_status: dto.payment_status,
      booking_date: new Date(),
      typeOfBooking: dto.typeOfBooking,
      no_of_rooms: dto.no_of_rooms,
      user_phone: dto.user_phone,
      coupon: couponCode ? couponCode : null,
    });

    const savedBooking = await this.bookingRepo.save(booking);

    allRooms.forEach(async (room) => {
      if (room?.room_num) {
        await this.roomService.updateBookingId(room.room_num, savedBooking);
      }
    });

    return savedBooking;
  }

  async findBooking(id: number) {
    return this.bookingRepo.findOne({
      where: { booking_id: id },
      relations: ['user', 'coupon', 'employee'],
    });
  }

  async findAll() {
    return this.bookingRepo.find({ relations: ['user', 'coupon', 'employee'] });
  }

  async updateBooking(id: number, dto: Partial<CreateBookingDto>) {
    const booking = await this.bookingRepo.findOneBy({ booking_id: id });
    if (!booking) throw new NotFoundException('Booking not found');
    Object.assign(booking, dto);
    return this.bookingRepo.save(booking);
  }

  async deleteBooking(id: number) {
    const booking = await this.bookingRepo.findOneBy({ booking_id: id });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.bookingRepo.remove(booking);
  }

  async confirmReservation(booking: Booking) {
    
  }
}
