import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Order } from '@/domain/main/enterprise/entities/order';
import { Prisma, Order as PrismaOrder } from '@prisma/client';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        userId: new UniqueEntityId(raw.userId).toString(),
        name: raw.name,
        isAvailableForPickup: raw.isAvailableForPickup,
        hasBeenPickedUp: raw.hasBeenPickedUp,
        hasBeenDelivered: raw.hasBeenDelivered,
        hasBeenReturned: raw.hasBeenReturned,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      userId: order.userId.toString(),
      name: order.name,
      isAvailableForPickup: order.isAvailableForPickup,
      hasBeenPickedUp: order.hasBeenPickedUp,
      hasBeenDelivered: order.hasBeenDelivered,
      hasBeenReturned: order.hasBeenReturned,
    };
  }
}
