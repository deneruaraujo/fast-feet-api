import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { OrderAttachmentsRepository } from '../repositories/order-attachments-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { OrderAttachmentList } from '../../enterprise/entities/order-attachment-list';
import { OrderAttachment } from '../../enterprise/entities/order-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AttachmentRequiredError } from './errors/attachment-required-error';
import { Injectable } from '@nestjs/common';

interface MarkOrderAsDeliveredUseCaseRequest {
  userId: string;
  orderId: string;
  hasBeenDelivered: boolean;
  attachmentsIds: string[];
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | AttachmentRequiredError,
  {
    order: Order;
  }
>;
@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository,
  ) {}

  async execute({
    userId,
    orderId,
    hasBeenDelivered,
    attachmentsIds,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== order.userId.toString()) {
      return left(new NotAllowedError());
    }

    const currentOrderAttachments =
      await this.orderAttachmentsRepository.findManyByOrderId(orderId);

    const orderAttachmentList = new OrderAttachmentList(
      currentOrderAttachments,
    );

    const orderAttachments = attachmentsIds.map((attachmentId) => {
      return OrderAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        orderId: order.id,
      });
    });

    orderAttachmentList.update(orderAttachments);

    order.userId = userId;
    order.hasBeenDelivered = hasBeenDelivered;
    order.attachments = orderAttachmentList;

    if (order.attachments.currentItems.length === 0) {
      return left(new AttachmentRequiredError());
    }

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
