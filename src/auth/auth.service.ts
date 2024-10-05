import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  createToken(user: Users) {
    return {
      accessToken: this.JWTService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: user.id,
          issuer: 'login POS',
          audience: 'POS Users',
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.JWTService.verify(token);
      return data;
    } catch (error) {
      throw new BadRequestException('Token inválido');
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);

      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    return this.createToken(user);
  }
  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email Incorreto');
    }

    //TO DO: Send email

    return true;
  }
  async reset(password: string, token: string) {
    const id = '0';

    const user = await this.prisma.users.update({
      where: { id },
      data: { password },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDto) {
    const user = await this.usersService.create(data);

    return this.createToken(user);
  }
}
