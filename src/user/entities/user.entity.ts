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

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nid?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  passport?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nationality: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Profession?: string;

  @Column({ type: 'integer', nullable: true })
  age?: number;

  @Column({ type: 'boolean', nullable: true })
  maritalStatus?: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vehicleNo?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fatherName?: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  RegistrationDate: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
