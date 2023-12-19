import { AggregateRoot } from '@/core/entities/aggregate-root';
import { OrderAttachmentList } from './order-attachment-list';
import { Recipient } from './recipient';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface OrderProps {
  deliverymanId: UniqueEntityId;
  recipient: Recipient;
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

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  get recipient() {
    return this.props.recipient;
  }

  get isAvailableForPickup() {
    return this.props.isAvailableForPickup;
  }

  get hasBeenPickedUp() {
    return this.props.hasBeenPickedUp;
  }

  get hasBeenDelivered() {
    return this.props.hasBeenDelivered;
  }

  get hasBeenReturned() {
    return this.props.hasBeenReturned;
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
