import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './DTOs/create-room.dto';
import { CreateRoomItemDto } from './DTOs/create-roomItem.dto';
import { UpdateRoomStatusDto } from './DTOs/update-room-status.dto';
import { UpdateHousekeepingStatusDto } from './DTOs/hk-status.dto';
import { ReportItemIssueDto } from './DTOs/report-item-issue.dto';
import { UpdateRoomItemDto } from './DTOs/update-roomItem.dto';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetRoomsDto } from './DTOs/get-rooms-dto';

@Auth(AuthType.None)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('all')
  public getAllRooms(@Query() roomQuery: GetRoomsDto) {
    return this.roomService.getAllRooms(roomQuery);
  }

  @Get('by-status/:room_status')
  public getRoomsByStatus(@Param('room_status') roomStatus: string) {
    return this.roomService.getRoomsByStatus(roomStatus);
  }

  @Post('create')
  public createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Post('create-item')
  public createRoomItem(@Body() createRoomItemDto: CreateRoomItemDto) {
    return this.roomService.createRoomItem(createRoomItemDto);
  }

  @Patch('update/:room_num/:item_name')
  public updateRoomItem(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Param('item_name') itemName: string,
    @Body() UpdateRoomItemDto: UpdateRoomItemDto,
  ) {
    return this.roomService.updateRoomItem(
      roomNum,
      itemName,
      UpdateRoomItemDto,
    );
  }

  @Put('update/:room_num/status')
  public updateRoomStatus(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Body() updateRoomStatusDto: UpdateRoomStatusDto,
  ) {
    return this.roomService.updateRoomStatus(roomNum, updateRoomStatusDto);
  }

  @Put('update/:room_num/hk-status')
  public updateHousekeepingStatus(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Body() updateHKSDto: UpdateHousekeepingStatusDto,
  ) {
    return this.roomService.updateHousekeepingStatus(roomNum, updateHKSDto);
  }

  @Patch(':room_num/items/:item_name/report-issue')
  public reportIssue(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Param('item_name') itemName: string,
    @Body() ReportItemIssueDto: ReportItemIssueDto,
  ) {
    return this.roomService.reportIssue(roomNum, itemName, ReportItemIssueDto);
  }
}
