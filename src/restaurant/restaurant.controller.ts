import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateMenuItemDto } from './DTOs/create-menu-item.dto';
import { PlaceOrderDto } from './DTOs/place-order.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) { }

    // Menu
    @Post('menu')
    createItem(@Body() body: CreateMenuItemDto) {
        return this.restaurantService.createMenuItem(body);
    }

    @Get('menu')
    getMenu() {
        return this.restaurantService.getAllMenuItems();
    }

    @Get('menu/:id')
    getMenuItem(@Param('id') id: number) {
        return this.restaurantService.getMenuItemById(+id);
    }

    @Patch('menu/:id')
    updateMenuItem(@Param('id') id: number, @Body() body: CreateMenuItemDto) {
        return this.restaurantService.updateMenuItem(+id, body);
    }

    @Delete('menu/:id')
    deleteMenuItem(@Param('id') id: number) {
        return this.restaurantService.deleteMenuItem(+id);
    }

    // Orders
    @Post('order')
    placeOrder(@Body() body: PlaceOrderDto) {
        return this.restaurantService.placeOrder(body);
    }

    @Get('order/history/:bookingId')
    getOrderHistory(@Param('bookingId') bookingId: number) {
        return this.restaurantService.getOrderHistoryByBookingId(+bookingId);
    }

    @Get('order/total/:bookingId')
    getTotal(@Param('bookingId') bookingId: number) {
        return this.restaurantService.calculateOrderTotal(+bookingId);
    }
}
