import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { HousekeepingService } from './housekeeping.service';
import { CreateHousekeepingDto } from './DTOs/create-housekeeping.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('housekeeping')
export class HousekeepingController {
    constructor(private readonly housekeepingService: HousekeepingService) { }

    @Post('create')
    create(@Body() dto: CreateHousekeepingDto) {
        return this.housekeepingService.create(dto);
    }

    @Get('all')
    findAll() {
        return this.housekeepingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.housekeepingService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.housekeepingService.remove(+id);
    }
}
