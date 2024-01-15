import { EventHandler } from '@/core/events/event-handler';
import { OrdersRepository } from '@/domain/main/application/repositories/orders-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { MarkedAsReturnedEvent } from '@/domain/main/enterprise/events/marked-as-returned-event';

export class OnMarkedAsReturned implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMarkedAsReturnedNotification.bind(this),
      MarkedAsReturnedEvent.name,
    );
  }

  private async sendMarkedAsReturnedNotification({
    order,
  }: MarkedAsReturnedEvent) {
    const markedOrder = await this.ordersRepository.findById(
      order.id.toString(),
    );

    if (markedOrder) {
      await this.sendNotification.execute({
        recipientId: order.recipient.id.toString(),
        title: 'Your order has been returned!',
        content: `The order "${order.name
          .substring(0, 30)
          .concat('...')}" has been returned!`,
      });
    }
  }
}
