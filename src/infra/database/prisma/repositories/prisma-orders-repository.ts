import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/main/application/repositories/orders-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '@/domain/main/enterprise/entities/order';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}
  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({
      data,
    });
  }
  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    });
  }
  async delete(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    });
  }
  async findById(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      null;
    }

    return PrismaOrderMapper.toDomain(order);
  }
  async findManyNearby(
    params: FindManyNearbyParams,
    paginationParams: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<Order[]>`
    SELECT DISTINCT o.*
    FROM "orders" o
    JOIN "recipients" r ON o."userId" = r."userId"
    WHERE ( 6371 * acos(
      cos( radians(${params.latitude}) ) *
      cos( radians( r.latitude ) ) *
      cos( radians( r.longitude ) - radians(${params.longitude}) ) +
      sin( radians(${params.latitude}) ) *
      sin( radians( r.latitude ) )
    ) ) <= 10
    LIMIT 20 OFFSET ${(paginationParams.page - 1) * 20}
  `;

    return orders;
  }

  async findManyByUserId(
    userId: string,
    paginationParams: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      take: 20,
      skip: (paginationParams.page - 1) * 20,
    });
    return orders.map(PrismaOrderMapper.toDomain);
  }
}
