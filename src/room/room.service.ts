import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rooms } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RoomItem } from './entities/room-item.entity';
import { create } from 'domain';
import { CreateRoomDto } from './DTOs/create-room.dto';
import { CreateRoomItemDto } from './DTOs/create-roomItem.dto';
import { UpdateRoomStatusDto } from './DTOs/update-room-status.dto';
import { UpdateHousekeepingStatusDto } from './DTOs/hk-status.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(RoomItem)
    private readonly roomItemRepository: Repository<RoomItem>,
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

  public async createRoomItem(@Body() createRoomItem: CreateRoomItemDto) {
    const roomItem = this.roomItemRepository.create(createRoomItem);
    return await this.roomItemRepository.save(roomItem);
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
}
