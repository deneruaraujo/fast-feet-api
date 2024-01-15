import { DomainEvent } from '@/core/events/domain-event';
import { Order } from '../entities/order';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class MarkedAsDeliveredEvent implements DomainEvent {
  public order: Order;
  public hasBeenDelivered: boolean;
  public ocurredAt: Date;

  constructor(order: Order, hasBeenDelivered: boolean) {
    this.order = order;
    this.hasBeenDelivered = hasBeenDelivered;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id;
  }
}
