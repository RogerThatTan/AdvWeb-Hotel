import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Employee } from '../../management/entities/employee.entity';

@Entity('CouponUsage')
export class CouponUsage {
  @PrimaryGeneratedColumn()
  usage_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  used_at: Date;

  @ManyToOne(() => Coupon, (coupon) => coupon.couponUsages)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @ManyToOne(() => Booking, (booking) => booking.couponUsages)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => Employee, (employee) => employee.couponUsages)
  @JoinColumn({ name: 'employee_id' })
  used_by: Employee;
}
