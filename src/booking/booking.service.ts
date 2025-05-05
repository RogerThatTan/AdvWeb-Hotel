import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, PaymentStatus, TypeOfBooking } from './entities/booking.entity';
import { Accounts, PaymentType } from './entities/accounts.entity';
import { CreateBookingDto } from './DTOs/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Accounts) private accountsRepo: Repository<Accounts>,
  ) {}

  async createBooking(dto: CreateBookingDto) {
    const booking = this.bookingRepo.create({
      checkin_date: dto.checkin_date,
      checkout_date: dto.checkout_date,
      number_of_guests: dto.number_of_guests,
      room_price: dto.room_price,
      coupon_percent: dto.coupon_percent ?? 0,
      total_price: dto.total_price,
      payment_status: dto.payment_status as PaymentStatus,
      booking_date: new Date(),
      typeOfBooking: dto.typeOfBooking as TypeOfBooking,
      service_asked: dto.service_asked,
      no_of_rooms: dto.no_of_rooms,
      user: { user_id: dto.user_id } as any,
      coupon: dto.coupon_id ? { coupon_id: dto.coupon_id } as any : null,
      employee: dto.employee_id ? { employee_id: dto.employee_id } as any : null,
    });

    return this.bookingRepo.save(booking);
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

  calculatePrice(basePrice: number, nights: number, couponPercent?: number) {
    const discount = couponPercent ? couponPercent / 100 : 0;
    return basePrice * nights * (1 - discount);
  }
}
