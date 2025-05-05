import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HousekeepingHistory } from './entities/housekeeping-history.entity';
import { CreateHousekeepingDto } from './DTOs/create-housekeeping.dto';

@Injectable()
export class HousekeepingService {
    constructor(
        @InjectRepository(HousekeepingHistory)
        private readonly housekeepingRepo: Repository<HousekeepingHistory>,
    ) { }

    public async create(dto: CreateHousekeepingDto) {
        const housekeeping = new HousekeepingHistory();

        housekeeping.date = new Date(dto.date);
        housekeeping.type_of_service = dto.type_of_service;
        housekeeping.issue_report = dto.issue_report;
        housekeeping.cleaner_feedback = dto.cleaner_feedback;

        // Temporarily mock relationships by assigning mock objects instead of querying repositories
        housekeeping.room = { room_num: dto.room } as any;  // Mocked room object
        housekeeping.cleaned_by = { employee_id: dto.cleaned_by } as any;  // Mocked employee object
        housekeeping.supervisor = { employee_id: dto.supervisor } as any;  // Mocked supervisor object

        if (dto.booking) {
            housekeeping.booking = { booking_id: dto.booking } as any;  // Mocked booking object
        }

        return this.housekeepingRepo.save(housekeeping);
    }

    public findAll() {
        return this.housekeepingRepo.find({
            relations: ['room', 'cleaned_by', 'supervisor', 'booking'],
        });
    }

    public findOne(id: number) {
        return this.housekeepingRepo.findOne({
            where: { housekeeping_id: id },
            relations: ['room', 'cleaned_by', 'supervisor', 'booking'],
        });
    }

    public async remove(id: number) {
        const entry = await this.housekeepingRepo.findOneBy({ housekeeping_id: id });
        if (!entry) throw new NotFoundException('Entry not found');
        return this.housekeepingRepo.remove(entry);
    }
}
