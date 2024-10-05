import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/database/prisma.service';

interface updateOrderData {
  clientId?: string;
  discount?: number;
  userId?: string;
  items?: {
    productId: string;
    quantity: number;
  }[];
}

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

  async findAll() {
    return await this.prisma.orders.findMany();
  }

  async findOneOrder(id: string) {
    await this.orderExists(id);

    try {
      return await this.prisma.orders.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeOrder(id: string) {
    await this.orderExists(id);

    try {
      return await this.prisma.orders.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async orderExists(id: string) {
    const order = await this.prisma.orders.count({
      where: {
        id,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }
  }
}
