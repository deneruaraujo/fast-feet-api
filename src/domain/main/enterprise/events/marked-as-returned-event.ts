import { DomainEvent } from '@/core/events/domain-event';
import { Order } from '../entities/order';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class MarkedAsReturnedEvent implements DomainEvent {
  public order: Order;
  public hasBeenReturned: boolean;
  public ocurredAt: Date;

  constructor(order: Order, hasBeenReturned: boolean) {
    this.order = order;
    this.hasBeenReturned = hasBeenReturned;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id;
  }
}
