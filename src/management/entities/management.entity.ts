import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('Management')
export class Management {
  @PrimaryGeneratedColumn()
  management_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login?: Date;

  @OneToOne(() => Employee, (employee) => employee.management)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
