import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Rooms } from '../../room/entities/room.entity';

export enum TypeOfBooking {
  WEBSITE = 'website',
  SELF = 'self',
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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  room_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  booking_date: Date;

  @Column({ type: 'enum', enum: TypeOfBooking })
  typeOfBooking: TypeOfBooking;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Rooms, (room) => room.reservations)
  @JoinColumn({ name: 'room_num' })
  room: Rooms;
}
