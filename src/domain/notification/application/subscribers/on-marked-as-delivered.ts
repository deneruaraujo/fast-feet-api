import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { OrdersRepository } from '@/domain/main/application/repositories/orders-repository';
import { MarkedAsDeliveredEvent } from '@/domain/main/enterprise/events/marked-as-delivered-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnMarkedAsDelivered implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMarkedAsDeliveredNotification.bind(this),
      MarkedAsDeliveredEvent.name,
    );
  }

  private async sendMarkedAsDeliveredNotification({
    order,
  }: MarkedAsDeliveredEvent) {
    const markedOrder = await this.ordersRepository.findById(
      order.id.toString(),
    );

    if (markedOrder) {
      await this.sendNotification.execute({
        recipientId: order.recipient.id.toString(),
        title: 'Your order has been picked up!',
        content: `The order "${order.name
          .substring(0, 20)
          .concat('...')}" has been delivered!`,
      });
    }
  }
}
