import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantHistory } from './entities/restaurant-history.entity';
import { BookingModule } from '../booking/booking.module';
import { ManagementModule } from '../management/management.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, RestaurantHistory]),
    BookingModule,
    ManagementModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
