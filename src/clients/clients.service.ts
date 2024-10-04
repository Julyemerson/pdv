import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    try {
      return this.prisma.clients.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return this.prisma.clients.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    await this.userExists(id);
    try {
      return this.prisma.clients.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, data: UpdateClientDto) {
    await this.userExists(id);
    try {
      return this.prisma.clients.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    await this.userExists(id);

    try {
      return this.prisma.clients.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async userExists(id: string) {
    const client = await this.prisma.clients.count({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
  }
}
