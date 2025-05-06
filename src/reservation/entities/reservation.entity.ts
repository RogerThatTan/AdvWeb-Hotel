import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Rooms } from '../../room/entities/room.entity';

export enum TypeOfBooking {
  WEBSITE = 'online',
  SELF = 'offline',
}

@Entity('Reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @Column({ type: 'date' })
  checkin_date: Date;

  @Column({ type: 'date' })
  checkout_date: Date;

  @Column()
  number_of_guests: number;

  @Column({ type: 'int', nullable: false })
  room_price: number;

  @Column({ type: 'int', nullable: false })
  discount_price: number;

  @Column({ type: 'int', nullable: false })
  total_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reservation_date: Date;

  @Column({ type: 'enum', enum: TypeOfBooking })
  typeOfBooking: TypeOfBooking;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  phone: string;

  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: false })
  no_of_rooms: number;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  coupon_code?: string;
}
