import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './DTOs/create-coupon.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Auth(AuthType.None)
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // @Roles('admin', 'customer')
  @Get('all')
  public getCoupons() {
    return this.couponService.getAllCoupons();
  }

  // @Roles('admin')
  @Post('create')
  public async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.createCoupon(createCouponDto);
  }

  // @Roles('customer')
  @Get('search/:coupon_code')
  public async getCouponByCode(@Param('coupon_code') coupon_code: string) {
    return await this.couponService.getCouponByCode(coupon_code);
  }

  // @Roles('admin')
  @Delete('delete/:coupon_name')
  public async deleteCoupon(@Body('coupon_name') coupon_name: string) {
    return await this.couponService.deleteCoupon(coupon_name);
  }
}
