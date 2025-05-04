import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './DTOs/create-inventory.dto';
import { UpdateInventoryDto } from './DTOs/update-inventory.dto';
import { IssueItemDto, ReturnItemDto } from './DTOs/issue-return.dto';
import { OrderItemDto } from './DTOs/order-item.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
@Auth(AuthType.None)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('add')
  public async addInventory(@Body() createInventoryDto: CreateInventoryDto) {
    return await this.inventoryService.createInventory(createInventoryDto);
  }

  @Patch('/update/:serial_id')
  public updateInventory(
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Param('serial_id', ParseIntPipe) serial_id: number,
  ) {
    return this.inventoryService.updateInventory(serial_id, updateInventoryDto);
  }

  @Patch('/issue/:serial_id')
  public issueInventory(
    @Body() issueItemDto: IssueItemDto,
    @Param('serial_id', ParseIntPipe) serial_id: number,
  ) {
    return this.inventoryService.IssueItem(serial_id, issueItemDto);
  }

  @Patch('/return/:serial_id')
  public returnInventory(
    @Body() returnItemDto: ReturnItemDto,
    @Param('serial_id', ParseIntPipe) serial_id: number,
  ) {
    return this.inventoryService.ReturnItem(serial_id, returnItemDto);
  }

  @Patch('/order/:serial_id')
  public orderInventory(
    @Body() orderItemDto: OrderItemDto,
    @Param('serial_id', ParseIntPipe) serial_id: number,
  ) {
    return this.inventoryService.orderItem(serial_id, orderItemDto);
  }

  @Get('all')
  public async getAllInventory() {
    return await this.inventoryService.getAllInventory();
  }
}
