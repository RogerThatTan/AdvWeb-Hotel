import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RoomItem } from './entities/room-item.entity';
import { create } from 'domain';
import { CreateRoomDto } from './DTOs/create-room.dto';
import { CreateRoomItemDto } from './DTOs/create-roomItem.dto';
import { UpdateRoomStatusDto } from './DTOs/update-room-status.dto';
import { UpdateHousekeepingStatusDto } from './DTOs/hk-status.dto';
import { ReportItemIssueDto } from './DTOs/report-item-issue.dto';
import { Employee } from 'src/management/entities/employee.entity';
import { UpdateRoomItemDto } from './DTOs/update-roomItem.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(RoomItem)
    private readonly roomItemRepository: Repository<RoomItem>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  public async getAllRooms() {
    return await this.roomRepository.find({
      relations: ['roomItems'],
    });
  }

  public async getRoomsByStatus(roomStatus: any) {
    return await this.roomRepository.find({
      where: { room_status: roomStatus },
      relations: ['roomItems'],
    });
  }

  public async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const room = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(room);
  }

  public async updateRoomStatus(
    roomNum: number,
    updateRoomStatusDto: UpdateRoomStatusDto,
  ) {
    const room = await this.roomRepository.findOneBy({ room_num: roomNum });
    if (!room) {
      throw new Error('Room not found');
    }
    room.room_status = updateRoomStatusDto.room_status;
    return await this.roomRepository.save(room);
  }

  public async updateHousekeepingStatus(
    roomNum: number,
    updateHKSDto: UpdateHousekeepingStatusDto,
  ) {
    const room = await this.roomRepository.findOneBy({ room_num: roomNum });
    if (!room) {
      throw new Error('Room not found');
    }
    room.housekeeping_status = updateHKSDto.housekeeping_status;
    return await this.roomRepository.save(room);
  }

  public async reportIssue(
    room_num: number,
    item_name: string,
    reportItemIssueDto: ReportItemIssueDto,
  ) {
    const room = await this.roomRepository.findOne({ where: { room_num } });
    if (!room) {
      throw new NotFoundException(`Room ${room_num} does not exist.`);
    }

    const item = await this.roomItemRepository.findOne({
      where: {
        room: { room_num },
        item_name,
      },
      relations: ['room'],
    });

    if (!item) {
      throw new NotFoundException(
        `Item '${item_name}' not found in Room ${room_num}.`,
      );
    }

    item.issue_report = reportItemIssueDto.issue_report;
    item.status = reportItemIssueDto.status;
    return await this.roomItemRepository.save(item);
  }

  public async createRoomItem(@Body() createRoomItem: CreateRoomItemDto) {
    const room = await this.roomRepository.findOne({
      where: { room_num: createRoomItem.room_num },
    });
    if (!room) {
      throw new NotFoundException(`Room ${createRoomItem.room_num} not found.`);
    }
    const employee = await this.employeeRepository.findOne({
      where: { employee_id: createRoomItem.employee_id },
    });
    if (!employee) {
      throw new NotFoundException(
        `Employee ${createRoomItem.employee_id} not found.`,
      );
    }
    const roomItem = this.roomItemRepository.create({
      ...createRoomItem,
      room: room,
      checked_by: employee,
    });
    return await this.roomItemRepository.save(roomItem);
  }

  public async updateRoomItem(
    roomNum: number,
    itemName: string,
    updateRoomItemDto: UpdateRoomItemDto,
  ) {
    const item = await this.roomItemRepository.findOne({
      where: { room: { room_num: roomNum }, item_name: itemName },
      relations: ['room', 'checked_by'],
    });
    if (!item) throw new NotFoundException(`Item '${itemName}' not found`);

    // Quick existence checks (optional)
    if (updateRoomItemDto.room_num) {
      const roomExists = await this.roomRepository.exist({
        where: { room_num: updateRoomItemDto.room_num },
      });
      if (!roomExists) throw new NotFoundException('Room not found');
    }

    if (updateRoomItemDto.employee_id) {
      const employeeExists = await this.employeeRepository.exist({
        where: { employee_id: updateRoomItemDto.employee_id },
      });
      if (!employeeExists) throw new NotFoundException('Employee not found');
    }

    Object.assign(item, updateRoomItemDto);
    return this.roomItemRepository.save(item);
  }
}
