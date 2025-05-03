import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../management/entities/employee.entity';

@Entity('Inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  serial_id: number;

  @Column({ type: 'varchar', length: 100 })
  item_name: string;

  @Column()
  quantity: number;

  @Column()
  issued: number;

  @Column()
  returned: number;

  @Column()
  used: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  ordered: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  order_price?: number;

  @ManyToOne(() => Employee, (employee) => employee.inventories)
  @JoinColumn({ name: 'employee_id' })
  updated_by: Employee;
}
