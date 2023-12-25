import { OrderAttachmentsRepository } from '@/domain/main/application/repositories/order-attachments-repository';
import { OrdersRepository } from '@/domain/main/application/repositories/orders-repository';
import { Order } from '@/domain/main/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  constructor(private orderAttachmentsRepository: OrderAttachmentsRepository) {}
  async create(order: Order) {
    this.items.push(order);
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items[itemIndex] = order;
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
}
