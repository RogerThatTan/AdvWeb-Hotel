import { Controller, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {

    constructor(private readonly bookingService: BookingService) {}

    @Post('create')
    public createBooking(@Body() bookingData: any) {
        return this.bookingService.createBooking(bookingData);
    }
}   

