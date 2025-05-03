import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './DTOs/create-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('all')
  public getCoupons() {
    return this.couponService.getAllCoupons();
  }

  @Post('create')
  public async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.createCoupon(createCouponDto);
  }
  @Get('search/:coupon_code')
  public async getCouponByCode(@Param('coupon_code') coupon_code: string) {
    return await this.couponService.getCouponByCode(coupon_code);
  }

  @Delete('delete/:coupon_name')
  public async deleteCoupon(@Body('coupon_name') coupon_name: string) {
    return await this.couponService.deleteCoupon(coupon_name);
  }
}
