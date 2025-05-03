import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { RoomItem } from './room-item.entity';
import { HousekeepingHistory } from '../../housekeeping/entities/housekeeping-history.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export enum HousekeepingStatus {
  CLEAN = 'clean',
  WAITING_FOR_CLEAN = 'waiting_for_clean',
  NEEDS_SERVICE = 'needs_service',
}

@Entity('Rooms')
export class Rooms {
  @PrimaryColumn()
  room_num: number;

  @Column()
  floor: number;

  @Column()
  capacity: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  room_price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'enum', enum: RoomStatus })
  room_status: RoomStatus;

  @Column({ type: 'enum', enum: HousekeepingStatus })
  housekeeping_status: HousekeepingStatus;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];

  @OneToMany(() => RoomItem, (roomItem) => roomItem.room)
  roomItems: RoomItem[];

  @OneToMany(() => HousekeepingHistory, (history) => history.room)
  housekeepingHistory: HousekeepingHistory[];

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];
}
