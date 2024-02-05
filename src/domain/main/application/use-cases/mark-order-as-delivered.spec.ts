import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { MarkOrderAsDeliveredUseCase } from './mark-order-as-delivered';
import { makeOrder } from 'test/factories/make-order';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeOrderAttachment } from 'test/factories/make-order-attachments';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { AttachmentRequiredError } from './errors/attachment-required-error';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: MarkOrderAsDeliveredUseCase;

describe('Mark Order As Delivered', () => {
  inMemoryOrderAttachmentsRepository = new InMemoryOrderAttachmentsRepository();
  inMemoryOrdersRepository = new InMemoryOrdersRepository(
    inMemoryOrderAttachmentsRepository,
  );
  inMemoryUsersRepository = new InMemoryUsersRepository();

  sut = new MarkOrderAsDeliveredUseCase(
    inMemoryOrdersRepository,
    inMemoryOrderAttachmentsRepository,
  );

  it('should be able to mark an order as delivered', async () => {
    const user = makeUser({}, new UniqueEntityId('user-01'));

    await inMemoryUsersRepository.create(user);

    const newOrder = makeOrder(
      {
        userId: 'user-01',
        hasBeenDelivered: false,
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
      hasBeenDelivered: true,
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    });
  });

  it('should not be able to mark an order as delivered if it does not exist ', async () => {
    const user = makeUser({}, new UniqueEntityId('user-01'));

    await inMemoryUsersRepository.create(user);

    const newOrder = makeOrder(
      {
        userId: 'user-01',
        hasBeenDelivered: false,
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
      hasBeenDelivered: true,
      attachmentsIds: ['1', '2'],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to mark an order from another user', async () => {
    const user = makeUser({}, new UniqueEntityId('user-01'));

    await inMemoryUsersRepository.create(user);

    const newOrder = makeOrder(
      {
        userId: 'user-01',
        hasBeenDelivered: false,
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
      userId: 'user-02',
      hasBeenDelivered: true,
      attachmentsIds: ['1', '2'],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to mark an order without at least one attachment', async () => {
    const user = makeUser({}, new UniqueEntityId('user-01'));

    await inMemoryUsersRepository.create(user);

    const newOrder = makeOrder(
      {
        userId: 'user-01',
        hasBeenDelivered: false,
      },
      new UniqueEntityId('order-01'),
    );

    await inMemoryOrdersRepository.create(newOrder);

    const result = await sut.execute({
      orderId: 'order-01',
      userId: 'user-01',
      hasBeenDelivered: true,
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AttachmentRequiredError);
  });
});
