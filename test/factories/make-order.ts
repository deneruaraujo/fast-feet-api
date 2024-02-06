import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Order, OrderProps } from '@/domain/main/enterprise/entities/order';
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      userId: new UniqueEntityId().toString(),
      name: faker.person.fullName(),
      isAvailableForPickup: false,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });

    return order;
  }
}
