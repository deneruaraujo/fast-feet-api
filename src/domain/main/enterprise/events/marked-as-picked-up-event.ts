import { DomainEvent } from '@/core/events/domain-event';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Order } from '../entities/order';

export class MarkedAsPickedUpEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public hasBeenPickedUp: boolean;

  constructor(order: Order, hasBeenPickedUp: boolean) {
    this.order = order;
    this.hasBeenPickedUp = hasBeenPickedUp;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id;
  }
}
