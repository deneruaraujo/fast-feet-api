import { OrderAttachmentsRepository } from '@/domain/main/application/repositories/order-attachments-repository';
import { OrdersRepository } from '@/domain/main/application/repositories/orders-repository';
import { Order } from '@/domain/main/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  constructor(private orderAttachmentsRepository: OrderAttachmentsRepository) {}
  async create(order: Order) {
    this.items.push(order);
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }
}
