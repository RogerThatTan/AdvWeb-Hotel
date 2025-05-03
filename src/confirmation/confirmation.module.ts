import { Module } from '@nestjs/common';
import { ConfirmationController } from './confirmation.controller';
import { ConfirmationService } from './confirmation.service';
import { BookingModule } from '../booking/booking.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [BookingModule, UserModule],
  controllers: [ConfirmationController],
  providers: [ConfirmationService]
})
export class ConfirmationModule {}
