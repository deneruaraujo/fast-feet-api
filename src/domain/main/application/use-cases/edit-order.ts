import { Either, left, right } from '@/core/either';
import { User } from '../../enterprise/entities/user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { OrdersRepository } from '../repositories/orders-repository';
import { UserRole } from '@/core/enum/user-role.enum';
import { OrderAttachmentsRepository } from '../repositories/order-attachments-repository';
import { OrderAttachmentList } from '../../enterprise/entities/order-attachment-list';
import { OrderAttachment } from '../../enterprise/entities/order-attachment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface EditOrderUseCaseRequest {
  orderId: string;
  userId: string;
  isAvailableForPickup: boolean;
  hasBeenPickedUp: boolean;
  hasBeenDelivered: boolean;
  hasBeenReturned: boolean;
  attachmentsIds: string[];
  user: User;
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

export class EditOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository,
  ) {}

  async execute({
    orderId,
    userId,
    isAvailableForPickup,
    hasBeenPickedUp,
    hasBeenDelivered,
    hasBeenReturned,
    attachmentsIds,
    user,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (user.role !== UserRole.Admin) {
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
    order.isAvailableForPickup = isAvailableForPickup;
    order.hasBeenPickedUp = hasBeenPickedUp;
    order.hasBeenDelivered = hasBeenDelivered;
    order.hasBeenReturned = hasBeenReturned;
    order.attachments = orderAttachmentList;

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
