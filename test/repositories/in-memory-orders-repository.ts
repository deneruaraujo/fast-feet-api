import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { OrderAttachmentsRepository } from '@/domain/main/application/repositories/order-attachments-repository';
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/main/application/repositories/orders-repository';
import { Order } from '@/domain/main/enterprise/entities/order';
import { getDistanceBetweenCoordinates } from 'test/utils/get-distance-between-coordinates';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  constructor(private orderAttachmentsRepository: OrderAttachmentsRepository) {}
  async create(order: Order) {
    this.items.push(order);

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items[itemIndex] = order;

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items.splice(itemIndex, 1);

    this.orderAttachmentsRepository.deleteManyByOrderId(order.id.toString());
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async findManyNearby(
    params: FindManyNearbyParams,
    { page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: params.latitude, longitude: params.longitude },
          {
            latitude: item.recipient.latitude,
            longitude: item.recipient.longitude,
          },
        );

        return distance < 10;
      })
      .slice((page - 1) * 20, page * 20); // 20 items per page;
  }

  async findManyByUserId(userId: string, { page }: PaginationParams) {
    const orders = this.items
      .filter((item) => item.userId === userId)
      .slice((page - 1) * 20, page * 20); // 20 items per page;

    return orders;
  }
}
