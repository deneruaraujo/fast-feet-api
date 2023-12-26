import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { EditOrderUseCase } from './edit-order';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/core/enum/user-role.enum';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeOrder } from 'test/factories/make-order';
import { makeOrderAttachment } from 'test/factories/make-order-attachments';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;

let sut: EditOrderUseCase;

describe('Edit Order', () => {
  inMemoryOrderAttachmentsRepository = new InMemoryOrderAttachmentsRepository();
  inMemoryOrdersRepository = new InMemoryOrdersRepository(
    inMemoryOrderAttachmentsRepository,
  );

  sut = new EditOrderUseCase(
    inMemoryOrdersRepository,
    inMemoryOrderAttachmentsRepository,
  );

  it('should be able to edit an order', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    const newOrder = makeOrder(
      {
        isAvailableForPickup: true,
        hasBeenPickedUp: true,
        hasBeenDelivered: true,
        hasBeenReturned: true,
      },
      new UniqueEntityId('order-01'),
    );

    await inMemoryOrdersRepository.create(newOrder);

    inMemoryOrderAttachmentsRepository.items.push(
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    const result = await sut.execute({
      orderId: 'order-01',
      userId: 'user-01',
      isAvailableForPickup: false,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
      attachmentsIds: ['1', '3'],
      user: user,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    });
  });

  it('should not be able to edit an order that does not exist', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    const newOrder = makeOrder(
      {
        isAvailableForPickup: true,
        hasBeenPickedUp: true,
        hasBeenDelivered: true,
        hasBeenReturned: true,
      },
      new UniqueEntityId('order-01'),
    );

    await inMemoryOrdersRepository.create(newOrder);

    inMemoryOrderAttachmentsRepository.items.push(
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    const result = await sut.execute({
      orderId: 'order-02',
      userId: 'user-01',
      isAvailableForPickup: false,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
      attachmentsIds: ['1', '3'],
      user: user,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit an order without admin role', async () => {
    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    const newOrder = makeOrder(
      {
        isAvailableForPickup: true,
        hasBeenPickedUp: true,
        hasBeenDelivered: true,
        hasBeenReturned: true,
      },
      new UniqueEntityId('order-01'),
    );

    await inMemoryOrdersRepository.create(newOrder);

    inMemoryOrderAttachmentsRepository.items.push(
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    const result = await sut.execute({
      orderId: 'order-01',
      userId: 'user-01',
      isAvailableForPickup: false,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
      attachmentsIds: ['1', '3'],
      user: user,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
