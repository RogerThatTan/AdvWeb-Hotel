import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: false, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nid: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  passport: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nationality: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  Profession: string;

  @Column({ type: 'integer', nullable: false })
  age: number;

  @Column({ type: 'boolean', nullable: false })
  maritalStatus: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vehicleNo?: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  fatherName: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registrationDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'customer' })
  role: string;

  // @OneToMany(() => Booking, (booking) => booking.user)
  // bookings: Booking[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
