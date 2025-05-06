import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, PaymentStatus, TypeOfBooking } from './entities/booking.entity';
import { Accounts, PaymentType } from './entities/accounts.entity';
import { CreateBookingDto } from './DTOs/create-booking.dto';
import { Coupon } from '../coupon/entities/coupon.entity';  // Import Coupon entity
import { CouponUsage } from '../coupon/entities/coupon-usage.entity';  // Import CouponUsage entity

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Accounts) private accountsRepo: Repository<Accounts>,
    @InjectRepository(Coupon) private couponRepo: Repository<Coupon>, // Inject Coupon repo
    @InjectRepository(CouponUsage) private couponUsageRepo: Repository<CouponUsage>, // Inject CouponUsage repo
  ) { }

  async createBooking(dto: CreateBookingDto) {
    let coupon: Coupon | null = null;

    // If coupon_id is provided, load and update the coupon
    if (dto.coupon_id) {
      coupon = await this.couponRepo.findOne({
        where: { coupon_id: dto.coupon_id },
      });

      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }

      if (coupon.quantity <= 0) {
        throw new NotFoundException('Coupon is no longer available');
      }

      // Decrease coupon quantity
      coupon.quantity -= 1;
      await this.couponRepo.save(coupon);

      // Create a new CouponUsage entry for tracking
      const couponUsage = this.couponUsageRepo.create({
        coupon_code: coupon.coupon_code,
        coupon: coupon,
      });

      await this.couponUsageRepo.save(couponUsage);
    }

    // Create a new booking entry
    const booking = this.bookingRepo.create({
      checkin_date: dto.checkin_date,
      checkout_date: dto.checkout_date,
      number_of_guests: dto.number_of_guests,
      room_price: dto.room_price,
      coupon_percent: coupon ? coupon.coupon_percent : 0,
      total_price: dto.total_price,
      payment_status: dto.payment_status,
      booking_date: new Date(),
      typeOfBooking: dto.typeOfBooking,
      service_asked: dto.service_asked,
      no_of_rooms: dto.no_of_rooms,
      user: { user_id: dto.user_id } as any,
      coupon: coupon ? { coupon_id: coupon.coupon_id } as any : null,
    });

    const savedBooking = await this.bookingRepo.save(booking);

    // After the booking is saved, link the coupon to the booking usage
    if (coupon) {
      const couponUsage = this.couponUsageRepo.create({
        coupon_code: coupon.coupon_code,
        coupon: coupon,
        booking: savedBooking, // Link the coupon to the created booking
      });

      await this.couponUsageRepo.save(couponUsage);
    }

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

  async calculatePriceFromBooking(bookingId: number): Promise<{ total_price: number }> {
    const booking = await this.bookingRepo.findOne({
      where: { booking_id: bookingId },
      relations: ['coupon'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const checkin = new Date(booking.checkin_date);
    const checkout = new Date(booking.checkout_date);
    const nights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));

    const basePrice = booking.room_price;
    const couponPercent = booking.coupon?.coupon_percent ?? 0;

    const discount = couponPercent / 100;
    const total_price = basePrice * nights * (1 - discount);

    return { total_price };
  }
}
