import { OrderItems } from './../../node_modules/.pnpm/@prisma+client@5.20.0_prisma@5.20.0/node_modules/.prisma/client/index.d';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/database/prisma.service';
import { error } from 'console';
import e from 'express';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: CreateOrderDto) {
    const { clientId, discount, items, userId } = data;

    try {
      const products = await this.prisma.products.findMany({
        where: {
          id: {
            in: items.map((item) => item.productId),
          },
        },
      });

      const total = products.reduce((acc, product) => {
        const item = items.find((item) => item.productId === product.id);
        return acc + (product.price * item?.quantity || 0);
      }, 0);

      const totalWithDiscount = Number(
        (total - (discount / 100) * total).toFixed(2),
      );

      if (Math.sign(totalWithDiscount) === -1) {
        throw new ForbiddenException('O desconto é maior que 0 preço total');
      }

      const orderItems = items.map((item) => ({
        product: {
          connect: {
            id: item.productId,
          },
        },
        quantity: item.quantity,
      }));

      return await this.prisma.orders.create({
        data: {
          clientId,
          userId,
          discount,
          total: totalWithDiscount,
          orderItems: {
            create: orderItems,
          },
        },
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, data: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
