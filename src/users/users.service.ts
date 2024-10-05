import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

interface DataUser {
  email?: string;
  name?: string;
  password?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);

    data.password = await bcrypt.hash(data.password, salt);

    try {
      return await this.prisma.users.create({
        data,
      });
    } catch (error) {}
  }

  async findAll() {
    try {
      return await this.prisma.users.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    await this.userExists(id);

    try {
      return await this.prisma.users.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, { email, name, password }: UpdateUserDto) {
    await this.userExists(id);

    const data: DataUser = {};

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);

      data.password = await bcrypt.hash(password, salt);
    }

    try {
      return await this.prisma.users.update({
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
      return await this.prisma.users.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async userExists(id: string) {
    const user = await this.prisma.users.count({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
