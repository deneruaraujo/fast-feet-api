import { OrderAttachmentsRepository } from '@/domain/main/application/repositories/order-attachments-repository';
import { OrderAttachment } from '@/domain/main/enterprise/entities/order-attachment';

export class InMemoryOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  public items: OrderAttachment[] = [];

  async findManyByOrderId(orderId: string) {
    const orderAttachments = this.items.filter(
      (item) => item.orderId.toString() === orderId,
    );

    return orderAttachments;
  }

  async deleteManyByOrderId(orderId: string) {
    const orderAttachments = this.items.filter(
      (item) => item.orderId.toString() !== orderId,
    );

    this.items = orderAttachments;
  }
}
