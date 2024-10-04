import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaService } from './database/prisma.service';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, ClientsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
