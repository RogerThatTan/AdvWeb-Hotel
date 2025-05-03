import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from './booking.entity';

export enum PaymentType {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
}

@Entity('Accounts')
export class Accounts {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  due: number;

  @Column({ type: 'enum', enum: PaymentType })
  payment_type: PaymentType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transaction_id?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @ManyToOne(() => Booking, (booking) => booking.accounts)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
