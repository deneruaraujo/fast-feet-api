import { DomainEvents } from '@/core/events/domain-events';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { OrdersRepository } from './../../../main/application/repositories/orders-repository';
import { EventHandler } from '@/core/events/event-handler';
import { MarkedAsPickedUpEvent } from '@/domain/main/enterprise/events/marked-as-picked-up-event';

export class OnMarkedAsPickedUp implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMarkedAsPickedUpNotification.bind(this),
      MarkedAsPickedUpEvent.name,
    );
  }

  private async sendMarkedAsPickedUpNotification({
    order,
  }: MarkedAsPickedUpEvent) {
    const markedOrder = await this.ordersRepository.findById(
      order.id.toString(),
    );

    if (markedOrder) {
      await this.sendNotification.execute({
        recipientId: order.recipient.id.toString(),
        title: 'Your order has been picked up!',
        content: `The order "${order.name
          .substring(0, 30)
          .concat('...')}" has been picked up and it will soon be delivered!`,
      });
    }
  }
}
