import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../management/entities/employee.entity';
import { SalaryHistory } from './salary-history.entity';

export enum SalaryStatus {
  PENDING = 'pending',
  PAID = 'paid',
  DISPUTED = 'disputed',
}

@Entity('Salary')
export class Salary {
  @PrimaryGeneratedColumn()
  salary_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  payment_date: Date;

  @Column({ type: 'enum', enum: SalaryStatus })
  status: SalaryStatus;

  @ManyToOne(() => Employee, (employee) => employee.salaries)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Employee, (employee) => employee.salariesPaid)
  @JoinColumn({ name: 'paid_by_employee_id' })
  paid_by: Employee;

  @OneToMany(() => SalaryHistory, (history) => history.salary)
  salaryHistory: SalaryHistory[];
}
