import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './DTOs/create-booking.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Get('all')
    findAll() {
        return this.bookingService.findAll();
    }

    @Post('create')
    createBooking(@Body() dto: CreateBookingDto) {
        return this.bookingService.createBooking(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.bookingService.findBooking(+id);
    }


    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: Partial<CreateBookingDto>) {
        return this.bookingService.updateBooking(+id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.bookingService.deleteBooking(+id);
    }
    @Get('calculate/price/:bookingId')
    calculatePriceFromBooking(@Param('bookingId') bookingId: number) {
        return this.bookingService.calculatePriceFromBooking(+bookingId);
    }

}


