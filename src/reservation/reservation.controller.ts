import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dtos/create.dto';

@Auth(AuthType.None)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('createReservation')
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createReservation(createReservationDto);
  }
}
