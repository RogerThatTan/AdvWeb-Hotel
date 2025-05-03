import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rooms } from './room.entity';
import { Employee } from '../../management/entities/employee.entity';

export enum ItemStatus {
  FUNCTIONAL = 'functional',
  NEEDS_REPAIR = 'needs_repair',
  MISSING = 'missing',
}

@Entity('RoomItem')
export class RoomItem {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column({ type: 'varchar', length: 100 })
  item_name: string;

  @Column({ type: 'enum', enum: ItemStatus })
  status: ItemStatus;

  @Column({ type: 'timestamp' })
  last_checked: Date;

  @Column({ type: 'text', nullable: true })
  issue_report?: string;

  @ManyToOne(() => Rooms, (room) => room.roomItems)
  @JoinColumn({ name: 'room_num' })
  room: Rooms;

  @ManyToOne(() => Employee, (employee) => employee.roomItems)
  @JoinColumn({ name: 'employee_id' })
  checked_by: Employee;
}
