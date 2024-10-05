import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/database/prisma.service';

interface ClientData {
  name?: string;
  email?: string;
  phone?: string;
}
@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    try {
      return await this.prisma.clients.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.clients.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    await this.userExists(id);
    try {
      return await this.prisma.clients.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, { name, email, phone }: UpdateClientDto) {
    await this.userExists(id);

    const data: ClientData = {};

    if (name) data.name = name;
    if (email) data.email = email;
    if (phone) data.phone = phone;

    try {
      return await this.prisma.clients.update({
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
      return await this.prisma.clients.delete({
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
