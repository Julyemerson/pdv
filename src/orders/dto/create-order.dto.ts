import { IsArray, IsNumber, IsString } from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsString()
  clientId: string;

  @IsNumber()
  discount: number;

  @IsArray()
  items: CreateOrderItemDto[];
}
