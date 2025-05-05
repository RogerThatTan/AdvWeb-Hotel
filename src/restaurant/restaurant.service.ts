import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantHistory } from './entities/restaurant-history.entity';
import { CreateMenuItemDto } from './DTOs/create-menu-item.dto';
import { PlaceOrderDto } from './DTOs/place-order.dto';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private restaurantRepo: Repository<Restaurant>,

        @InjectRepository(RestaurantHistory)
        private historyRepo: Repository<RestaurantHistory>,
    ) { }

    public async createMenuItem(data: CreateMenuItemDto) {
        return this.restaurantRepo.save(data);
    }

    public async getAllMenuItems() {
        return this.restaurantRepo.find();
    }

    public async getMenuItemById(id: number) {
        return this.restaurantRepo.findOneBy({ food_id: id });
    }

    public async updateMenuItem(id: number, data: CreateMenuItemDto) {
        await this.restaurantRepo.update(id, data);
        return this.getMenuItemById(id);
    }

    public async deleteMenuItem(id: number) {
        await this.restaurantRepo.delete(id);
    }

    public async placeOrder(dto: PlaceOrderDto) {
        const food = await this.restaurantRepo.findOneBy({ food_id: dto.foodId });
        if (!food) throw new NotFoundException('Food not found');

        const order = this.historyRepo.create({
            quantity: dto.quantity,
            food_price: food.item_price,
            order_date: new Date(),
            food,
            booking: { booking_id: dto.bookingId } as any,      // Mocked booking
            billed_by: { employee_id: dto.employeeId } as any,  // Mocked employee
        });

        return this.historyRepo.save(order);
    }

    public async calculateOrderTotal(bookingId: number): Promise<number> {
        const orders = await this.historyRepo.find({
            where: { booking: { booking_id: bookingId } },
            relations: ['booking'],
        });

        return orders.reduce((total, order) => {
            return total + Number(order.food_price) * order.quantity;
        }, 0);
    }

    public async getOrderHistoryByBookingId(bookingId: number) {
        return this.historyRepo.find({
            where: { booking: { booking_id: bookingId } },
            relations: ['food', 'billed_by'],
            order: { order_date: 'DESC' },
        });
    }
}
