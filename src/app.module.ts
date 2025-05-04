import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';
import { HousekeepingModule } from './housekeeping/housekeeping.module';
import { CouponModule } from './coupon/coupon.module';
import { InventoryModule } from './inventory/inventory.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { BillingModule } from './billing/billing.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryModule } from './salary/salary.module';
import { AdminModule } from './admin/admin.module';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';
import { HashingProvider } from './hash/hashing.provider';
import { HashModule } from './hash/hash.module';
import { HashService } from './hash/hash.service';
import { BcryptProvider } from './hash/bcrypt.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BookingModule,
    RoomModule,
    HousekeepingModule,
    CouponModule,
    InventoryModule,
    RestaurantModule,
    BillingModule,
    AuthModule,
    SalaryModule,
    AdminModule,
    ConfirmationModule,
    FeedbackModule,
    ReservationModule,
    UserModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        synchronize: true,
        port: 5432,
        username: 'postgres',
        password: 'root',
        host: 'localhost',
        autoLoadEntities: true,
        database: 'hotel_management',
      }),
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    HashModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
