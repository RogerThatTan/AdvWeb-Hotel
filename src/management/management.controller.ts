import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ManagementService } from './management.service';
import { CreateEmployeeDto } from './DTOs/create-employee.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { UpdateEmployeeDto } from './DTOs/update-employee.dto';

@Auth(AuthType.None)
@Controller('management')
export class ManagementController {
    constructor(private readonly managementService: ManagementService) {}

    @Post('/employee/create')
    public createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.managementService.createEmployee(createEmployeeDto);
    }

    @Patch('/employee/update/:employee_id')
    public updateEmployee(
        @Param('employee_id', ParseIntPipe) employeeId: number,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.managementService.updateEmployee(employeeId, updateEmployeeDto);
    }

    @Get('/employee/all')
    public getALLEmployees() {
        return this.managementService.getALLEmployees();
    }

    @Delete('/employee/delete/:employee_id')
    public deleteEmployee(@Param('employee_id', ParseIntPipe) employeeId: number) {
        return this.managementService.deleteEmployee(employeeId);
    }

    @Get('/employee/:employee_id')
    public getEmployeeById(@Param('employee_id', ParseIntPipe) employeeId: number) {
        return this.managementService.getEmployeeById(employeeId);
    }
}


