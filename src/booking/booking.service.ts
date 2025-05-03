import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Accounts } from './entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  public async createBooking(bookingData: any) {
    const booking = this.bookingRepository.create(bookingData);
    return await this.bookingRepository.save(booking);
  }
}
