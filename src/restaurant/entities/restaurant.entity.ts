import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RestaurantHistory } from './restaurant-history.entity';

export enum FoodType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
}

@Entity('Restaurant')
export class Restaurant {
  @PrimaryGeneratedColumn()
  food_id: number;

  @Column({ type: 'varchar', length: 100 })
  item_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  item_price: number;

  @Column({ type: 'enum', enum: FoodType })
  food_type: FoodType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  availability: boolean;

  @OneToMany(() => RestaurantHistory, (history) => history.food)
  restaurantHistory: RestaurantHistory[];
}
