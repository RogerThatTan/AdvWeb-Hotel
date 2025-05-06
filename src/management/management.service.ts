import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { Management } from './entities/management.entity';
import { CreateEmployeeDto } from './DTOs/create-employee.dto';
import { UpdateEmployeeDto } from './DTOs/update-employee.dto';

@Injectable()
export class ManagementService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        @InjectRepository(Management)
        private managementRepository: Repository<Management>,
    ) {}

    public async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        const employee = this.employeeRepository.create(createEmployeeDto);
        return await this.employeeRepository.save(employee);
    }

    public async updateEmployee(
        employeeId: number,
        updateEmployeeDto: UpdateEmployeeDto,
    ) {
        const employee = await this.employeeRepository.findOneBy({employee_id: employeeId});
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        Object.assign(employee, updateEmployeeDto);
        return await this.employeeRepository.save(employee);
    }

    public async getALLEmployees() {
        return await this.employeeRepository.find({
            relations: ['management'],
        });
    }

    public async deleteEmployee(employeeId: number) {
        const employee = await this.employeeRepository.findOneBy({employee_id: employeeId});
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        return await this.employeeRepository.remove(employee);
    }

    public async getEmployeeById(employeeId: number) {
        const employee = await this.employeeRepository.findOneBy({employee_id: employeeId});
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        return employee;
    }    

}
