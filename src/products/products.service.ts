import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/database/prisma.service';

interface ProductData {
  name?: string;
  price?: number;
  description?: string;
  barcode?: string;
}
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    try {
      return await this.prisma.products.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.products.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    await this.productExist(id);

    try {
      return await this.prisma.products.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    { name, price, description, barcode }: UpdateProductDto,
  ) {
    await this.productExist(id);

    const data: ProductData = {};

    if (name) data.name = name;
    if (price) data.price = price;
    if (description) data.description = description;
    if (barcode) data.barcode = barcode;

    try {
      return await this.prisma.products.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    await this.productExist(id);

    try {
      return await this.prisma.products.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async productExist(id: string) {
    const product = await this.prisma.products.count({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produto não encontrado`);
    }
  }
}
