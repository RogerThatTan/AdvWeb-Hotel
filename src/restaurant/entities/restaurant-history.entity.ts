import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { Restaurant } from './restaurant.entity';
import { Employee } from '../../management/entities/employee.entity';

@Entity('RestaurantHistory')
export class RestaurantHistory {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  food_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @ManyToOne(() => Booking, (booking) => booking.restaurantHistory)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.restaurantHistory)
  @JoinColumn({ name: 'food_id' })
  food: Restaurant;

  @ManyToOne(() => Employee, (employee) => employee.restaurantHistory)
  @JoinColumn({ name: 'employee_id' })
  billed_by: Employee;
}
