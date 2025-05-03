import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Management } from './management.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Coupon } from '../../coupon/entities/coupon.entity';
import { CouponUsage } from '../../coupon/entities/coupon-usage.entity';
import { RoomItem } from '../../room/entities/room-item.entity';
import { HousekeepingHistory } from '../../housekeeping/entities/housekeeping-history.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { RestaurantHistory } from '../../restaurant/entities/restaurant-history.entity';
import { Salary } from '../../salary/entities/salary.entity';
import { SalaryHistory } from '../../salary/entities/salary-history.entity';

export enum EmployeeRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  RECEPTIONIST = 'receptionist',
  FLOOR_MANAGER = 'floor_manager',
  RESTAURANT_RECEPTIONIST = 'restaurant_receptionist',
  CLERK = 'clerk',
  CLEANER = 'cleaner',
  WAITER = 'waiter',
  CHEF = 'chef',
  SECURITY_GUARD = 'security_guard',
  HOUSEKEEPING_STAFF = 'housekeeping_staff',
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
}

@Entity('Employee')
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: EmployeeRole })
  role: EmployeeRole;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nid?: string;

  @Column({ type: 'date' })
  hire_date: Date;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @OneToOne(() => Management, (management) => management.employee)
  management: Management;

  @OneToMany(() => Booking, (booking) => booking.employee)
  bookings: Booking[];

  @OneToMany(() => Coupon, (coupon) => coupon.created_by)
  coupons: Coupon[];

  @OneToMany(() => CouponUsage, (couponUsage) => couponUsage.used_by)
  couponUsages: CouponUsage[];

  @OneToMany(() => RoomItem, (roomItem) => roomItem.checked_by)
  roomItems: RoomItem[];

  @OneToMany(() => HousekeepingHistory, (history) => history.cleaned_by)
  housekeepingCleaned: HousekeepingHistory[];

  @OneToMany(() => HousekeepingHistory, (history) => history.supervisor)
  housekeepingSupervised: HousekeepingHistory[];

  @OneToMany(() => Inventory, (inventory) => inventory.updated_by)
  inventories: Inventory[];

  @OneToMany(() => RestaurantHistory, (history) => history.billed_by)
  restaurantHistory: RestaurantHistory[];

  @OneToMany(() => Salary, (salary) => salary.employee)
  salaries: Salary[];

  @OneToMany(() => Salary, (salary) => salary.paid_by)
  salariesPaid: Salary[];

  @OneToMany(() => SalaryHistory, (history) => history.employee)
  salaryHistory: SalaryHistory[];

  @OneToMany(() => SalaryHistory, (history) => history.recorded_by)
  salaryHistoryRecorded: SalaryHistory[];
}
