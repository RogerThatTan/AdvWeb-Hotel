import { Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms, RoomStatus } from './entities/room.entity';
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
import { GetRoomsDto } from './DTOs/get-rooms-dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { EmailService } from 'src/email/email.service'; // Add this import
import { join } from 'path';
import { readFileSync } from 'fs';
import * as ejs from 'ejs';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(RoomItem)
    private readonly roomItemRepository: Repository<RoomItem>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly paginationProvider: PaginationProvider,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  public async getAllRooms(roomQuery: GetRoomsDto): Promise<Paginated<Rooms>> {
    let rooms = await this.paginationProvider.paginateQuery(
      {
        limit: roomQuery.limit,
        page: roomQuery.page,
      },
      this.roomRepository,
    );
    return rooms;
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
    let room = await this.roomRepository.findOneBy({ room_num: roomNum });
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

    const savedItem = await this.roomItemRepository.save(item);

    const EMAIL_USER = process.env.EMAIL_USER || 'universuswebtech@gmail.com';

    await this.sendIssueReportEmail(
      EMAIL_USER,
      room_num,
      item_name,
      reportItemIssueDto.issue_report,
      reportItemIssueDto.status,
    );

    return savedItem;
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
    if (!item)
      throw new NotFoundException(
        `Item '${itemName}' not found in Room ${roomNum}`,
      );

    if (
      updateRoomItemDto.employee_id &&
      updateRoomItemDto.employee_id !== item.checked_by.employee_id
    ) {
      const employee = await this.employeeRepository.findOneBy({
        employee_id: updateRoomItemDto.employee_id,
      });
      if (!employee) throw new NotFoundException('Employee not found');
      item.checked_by = employee;
    }
    if (
      updateRoomItemDto.room_num &&
      updateRoomItemDto.room_num !== item.room.room_num
    ) {
      const room = await this.roomRepository.findOneBy({
        room_num: updateRoomItemDto.room_num,
      });
      if (!room) throw new NotFoundException('Room not found');
      item.room = room;
    }
    Object.assign(item, updateRoomItemDto);
    return this.roomItemRepository.save(item);
  }

  public async updateReservationId(
    roomNum: number,
    savedReservation: Reservation,
  ) {
    const room = await this.roomRepository.findOneBy({ room_num: roomNum });

    if (!room) {
      throw new NotFoundException(`Room ${roomNum} not found.`);
    }

    room.reservation = savedReservation;
    room.room_status = RoomStatus.RESERVED;
    return await this.roomRepository.save(room);
  }

  public async updateBookingId(roomNum: number, savedBooking: Booking) {
    const room = await this.roomRepository.findOneBy({ room_num: roomNum });

    if (!room) {
      throw new NotFoundException(`Room ${roomNum} not found.`);
    }

    room.booking = savedBooking;
    room.room_status = RoomStatus.OCCUPIED;
    return await this.roomRepository.save(room);
  }

  public async confirmReservation(reservationId: number, booking: Booking) {
    const rooms = await this.roomRepository.find({
      where: { reservation: { reservation_id: reservationId } },
      relations: ['reservation'],
    });

    rooms.forEach(async (room) => {
      if (room?.room_num) {
        room.room_status = RoomStatus.OCCUPIED;
        room.booking = booking;
        await this.roomRepository.save(room);
      }
    });

    return rooms;
  }

  private async sendIssueReportEmail(
    email: string,
    roomNumber: number,
    itemName: string,
    issueDescription: string,
    status: string,
  ) {
    try {
      const possiblePaths = [
        join(process.cwd(), 'src', 'email', 'templates', 'issue-report.ejs'),
        join(process.cwd(), 'dist', 'email', 'templates', 'issue-report.ejs'),
        join(__dirname, '..', '..', 'email', 'templates', 'issue-report.ejs'),
      ];

      let template;
      for (const path of possiblePaths) {
        try {
          template = readFileSync(path, 'utf8');
          break;
        } catch (e) {
          continue;
        }
      }

      if (!template) {
        throw new Error('Issue report template not found');
      }

      const html = ejs.render(template, {
        roomNumber,
        itemName,
        issueDescription,
        status,
      });

      await this.emailService.sendEmail({
        recipients: [email],
        subject: `Issue Reported for Room ${roomNumber} - ${itemName}`,
        html: html,
      });
    } catch (error) {
      console.error('Error sending issue report email:', error);
      // Fallback to simple text email
      await this.emailService.sendEmail({
        recipients: [email],
        subject: `Issue Reported for Room ${roomNumber}`,
        html: `
                <p><strong>Item:</strong> ${itemName}</p>
                <p><strong>Issue:</strong> ${issueDescription}</p>
                <p><strong>Status:</strong> ${status}</p>
            `,
      });
    }
  }
}
