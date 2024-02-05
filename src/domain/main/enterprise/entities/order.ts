import { AggregateRoot } from '@/core/entities/aggregate-root';
import { OrderAttachmentList } from './order-attachment-list';
import { Recipient } from './recipient';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { MarkedAsPickedUpEvent } from '../events/marked-as-picked-up-event';
import { MarkedAsDeliveredEvent } from '../events/marked-as-delivered-event';
import { MarkedAsReturnedEvent } from '../events/marked-as-returned-event';

export interface OrderProps {
  userId: string;
  name: string;
  recipient?: Recipient;
  isAvailableForPickup: boolean;
  hasBeenPickedUp: boolean;
  hasBeenDelivered: boolean;
  hasBeenReturned: boolean;
  attachments: OrderAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  private touch() {
    this.props.updatedAt = new Date();
  }

  get userId() {
    return this.props.userId;
  }

  set userId(userId: string) {
    this.props.userId = userId;
    this.touch();
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get recipient() {
    return this.props.recipient;
  }

  set recipient(recipient: Recipient) {
    this.props.recipient = recipient;
    this.touch();
  }

  get isAvailableForPickup() {
    return this.props.isAvailableForPickup;
  }

  set isAvailableForPickup(isAvailableForPickup: boolean) {
    this.props.isAvailableForPickup = isAvailableForPickup;
    this.touch();
  }

  get hasBeenPickedUp() {
    return this.props.hasBeenPickedUp;
  }

  set hasBeenPickedUp(hasBeenPickedUp: boolean) {
    if (hasBeenPickedUp && hasBeenPickedUp !== this.props.hasBeenPickedUp) {
      this.addDomainEvent(new MarkedAsPickedUpEvent(this, hasBeenPickedUp));
    }

    this.props.hasBeenPickedUp = hasBeenPickedUp;
    this.touch();
  }

  get hasBeenDelivered() {
    return this.props.hasBeenDelivered;
  }

  set hasBeenDelivered(hasBeenDelivered: boolean) {
    if (hasBeenDelivered && hasBeenDelivered !== this.props.hasBeenDelivered) {
      this.addDomainEvent(new MarkedAsDeliveredEvent(this, hasBeenDelivered));
    }

    this.props.hasBeenDelivered = hasBeenDelivered;
    this.touch();
  }

  get hasBeenReturned() {
    return this.props.hasBeenReturned;
  }

  set hasBeenReturned(hasBeenReturned: boolean) {
    if (hasBeenReturned && hasBeenReturned !== this.props.hasBeenReturned) {
      this.addDomainEvent(new MarkedAsReturnedEvent(this, hasBeenReturned));
    }

    this.props.hasBeenReturned = hasBeenReturned;
    this.touch();
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: OrderAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'attachments' | 'recipient'>,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        ...props,
        attachments: props.attachments ?? new OrderAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
        recipient: props.recipient,
      },
      id,
    );

    return order;
  }
}
