import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRoomItemDto } from './create-roomItem.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRoomItemDto extends PartialType(CreateRoomItemDto) {}
