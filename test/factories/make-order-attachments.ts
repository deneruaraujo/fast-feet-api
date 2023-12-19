import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  OrderAttachment,
  OrderAttachmentProps,
} from '@/domain/main/enterprise/entities/order-attachment';

export function makeOrderAttachment(
  override: Partial<OrderAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const orderAttachment = OrderAttachment.create(
    {
      orderId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return orderAttachment;
}
