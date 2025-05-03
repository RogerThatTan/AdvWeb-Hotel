import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../management/entities/employee.entity';
import { Salary } from './salary.entity';

export enum SalaryActionType {
  PAYMENT = 'payment',
  ADJUSTMENT = 'adjustment',
  DISPUTE = 'dispute',
  APPROVAL = 'approval',
}

@Entity('SalaryHistory')
export class SalaryHistory {
  @PrimaryGeneratedColumn()
  history_id: number;

  @Column({ type: 'enum', enum: SalaryActionType })
  action_type: SalaryActionType;

  @Column({ type: 'text' })
  details: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bonus: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalSalary: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => Employee, (employee) => employee.salaryHistory)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Employee, (employee) => employee.salaryHistoryRecorded)
  @JoinColumn({ name: 'recorded_by_employee_id' })
  recorded_by: Employee;

  @ManyToOne(() => Salary, (salary) => salary.salaryHistory, { nullable: true })
  @JoinColumn({ name: 'salary_id' })
  salary?: Salary;
}
