import { Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/management/entities/employee.entity';
import { CreateInventoryDto } from './DTOs/create-inventory.dto';
import { UpdateInventoryDto } from './DTOs/update-inventory.dto';
import { IssueItemDto, ReturnItemDto } from './DTOs/issue-return.dto';
import { OrderItemDto } from './DTOs/order-item.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
    ) {}

    async createInventory(createInventoryDto: CreateInventoryDto) {
        const employee = await this.employeeRepository.findOneBy({ employee_id: createInventoryDto.employee_id });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        const inventory = this.inventoryRepository.create(createInventoryDto);
        inventory.updated_by = employee; 
        relations: 
        return await this.inventoryRepository.save(inventory);

    }

    async updateInventory(Serial_ID:number, updateInventoryDto: UpdateInventoryDto)
    {
        const inventory = await this.inventoryRepository.findOneBy({ serial_id: Serial_ID });
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }
        const employee = await this.employeeRepository.findOneBy({ employee_id: updateInventoryDto.employee_id });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        inventory.updated_by = employee; 
        Object.assign(inventory, updateInventoryDto);
        return await this.inventoryRepository.save(inventory);
    } 

    async IssueItem(Serial_ID: number, issueItemDto: IssueItemDto)
    {
        const inventory = await this.inventoryRepository.findOneBy({ serial_id: Serial_ID });
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }
        const employee = await this.employeeRepository.findOneBy({ employee_id: issueItemDto.employee_id });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        if (inventory.quantity < issueItemDto.issued) 
        {
            throw new NotFoundException('Not enough items in stock to issue');
        }
        inventory.quantity -= issueItemDto.issued;
        inventory.issued += issueItemDto.issued;
        inventory.used = inventory.issued - inventory.returned;
        inventory.updated_by = employee;
        Object.assign(inventory, issueItemDto);
        return await this.inventoryRepository.save(inventory);
    }

    async ReturnItem(Serial_ID: number, returnItemDto: ReturnItemDto)
    {
        const inventory = await this.inventoryRepository.findOneBy({ serial_id: Serial_ID });
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }
        const employee = await this.employeeRepository.findOneBy({ employee_id: returnItemDto.employee_id });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        if (inventory.issued < returnItemDto.returned) 
        {
            throw new NotFoundException('Not enough items issued to return');
        }
        inventory.quantity += returnItemDto.returned;
        inventory.returned += returnItemDto.returned;
        inventory.used = inventory.issued - inventory.returned;
        inventory.updated_by = employee;
        Object.assign(inventory, returnItemDto);
        return await this.inventoryRepository.save(inventory);
    }

    async orderItem(Serial_ID: number, orderItemDto: OrderItemDto)
    {
        const inventory = await this.inventoryRepository.findOneBy({ serial_id: Serial_ID });
        if (!inventory) {
            throw new NotFoundException('Inventory not found');
        }
        const employee = await this.employeeRepository.findOneBy({ employee_id: orderItemDto.employee_id });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }
        inventory.ordered += orderItemDto.ordered;
        inventory.quantity = inventory.quantity + orderItemDto.ordered;
        inventory.order_price = orderItemDto.order_price;
        Object.assign(inventory, orderItemDto);
        return await this.inventoryRepository.save(inventory);
    }

    async getAllInventory()
    {
        return await this.inventoryRepository.find({ relations: ['updated_by'] });
    }

}