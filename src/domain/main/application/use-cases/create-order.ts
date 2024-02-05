import { Either, left, right } from '@/core/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderAttachment } from '../../enterprise/entities/order-attachment';
import { OrderAttachmentList } from '../../enterprise/entities/order-attachment-list';
import { UserRole } from '@/core/enum/user-role.enum';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';

interface CreateOrderUseCaseRequest {
  userId: string;
  name: string;
  recipient?: Recipient;
  isAvailableForPickup: boolean;
  hasBeenPickedUp: boolean;
  hasBeenDelivered: boolean;
  hasBeenReturned: boolean;
  attachmentsIds: string[];
}

type CreateOrderUseCaseResponse = Either<
  NotAllowedError,
  {
    order: Order;
  }
>;
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    name,
    recipient,
    isAvailableForPickup,
    hasBeenPickedUp,
    hasBeenDelivered,
    hasBeenReturned,
    attachmentsIds,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      userId,
      name,
      recipient,
      isAvailableForPickup,
      hasBeenPickedUp,
      hasBeenDelivered,
      hasBeenReturned,
    });

    const user = await this.usersRepository.findById(userId);

    if (user.role !== UserRole.Admin) {
      return left(new NotAllowedError());
    }

    const orderAttachments = attachmentsIds.map((attachmentId) => {
      return OrderAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        orderId: order.id,
      });
    });

    order.attachments = new OrderAttachmentList(orderAttachments);

    await this.ordersRepository.create(order);

    return right({
      order,
    });
  }
}
