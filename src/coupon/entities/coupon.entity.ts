import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Employee } from '../../management/entities/employee.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { CouponUsage } from './coupon-usage.entity';

@Entity('Coupon')
export class Coupon {
  @PrimaryGeneratedColumn()
  coupon_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  coupon_code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  coupon_percent: number;

  @Column({ type: 'boolean' })
  is_active: boolean;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expire_at: Date;

  @BeforeInsert()
  setInitialActiveStatus() {
    this.is_active = true;
    this.created_at = new Date();
  }

  @BeforeUpdate()
  updateActiveStatus() {
    if (new Date() >= this.expire_at) {
      this.is_active = false;
    }
    if (this.quantity <= 0) {
      this.is_active = false;
    }
  }

  @ManyToOne(() => Employee, (employee) => employee.coupons)
  @JoinColumn({ name: 'employee_id' })
  created_by: Employee;

  @OneToMany(() => Booking, (booking) => booking.coupon)
  bookings: Booking[];

  @OneToMany(() => CouponUsage, (couponUsage) => couponUsage.coupon)
  couponUsages: CouponUsage[];
}
