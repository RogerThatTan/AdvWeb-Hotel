import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dtos/create.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('createReservation')
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
    @Res() res: Response,
  ) {
    if (!res) {
      throw new HttpException(
        'Response object is undefined',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.reservationService.createReservation(createReservationDto, res);
  }
  @Roles('admin')
  @Post('confirm')
  async confirmReservation(@Body() body: { reservation_id: number }) {
    const { reservation_id } = body;
    return this.reservationService.confirmReservation(reservation_id);
  }
}
