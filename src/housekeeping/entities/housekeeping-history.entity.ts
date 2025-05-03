import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rooms } from '../../room/entities/room.entity';
import { Employee } from '../../management/entities/employee.entity';
import { Booking } from '../../booking/entities/booking.entity';

export enum ServiceType {
  CLEANING = 'cleaning',
  SERVICE_REQUEST = 'service_request',
  MAINTENANCE = 'maintenance',
}

@Entity('HousekeepingHistory')
export class HousekeepingHistory {
  @PrimaryGeneratedColumn()
  housekeeping_id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'enum', enum: ServiceType })
  type_of_service: ServiceType;

  @Column({ type: 'text', nullable: true })
  issue_report?: string;

  @Column({ type: 'text', nullable: true })
  cleaner_feedback?: string;

  @ManyToOne(() => Rooms, (room) => room.housekeepingHistory)
  @JoinColumn({ name: 'room_num' })
  room: Rooms;

  @ManyToOne(() => Employee, (employee) => employee.housekeepingCleaned)
  @JoinColumn({ name: 'cleaner_id' })
  cleaned_by: Employee;

  @ManyToOne(() => Employee, (employee) => employee.housekeepingSupervised)
  @JoinColumn({ name: 'supervisor_employee_id' })
  supervisor: Employee;

  @ManyToOne(() => Booking, (booking) => booking.housekeepingHistory, {
    nullable: true,
  })
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;
}
