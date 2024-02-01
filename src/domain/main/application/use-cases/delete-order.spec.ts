import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { DeleteOrderUseCase } from './delete-order';
import { makeOrder } from 'test/factories/make-order';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/core/enum/user-role.enum';
import { makeOrderAttachment } from 'test/factories/make-order-attachments';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let sut: DeleteOrderUseCase;

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new DeleteOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to delete an order', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const newOrder = makeOrder({}, new UniqueEntityId('order-01'));

    await inMemoryOrdersRepository.create(newOrder);

    inMemoryOrderAttachmentsRepository.items.push(
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    );

    const result = await sut.execute({
      userId: 'user-01',
      orderId: 'order-01',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrdersRepository.items).toHaveLength(0);
    expect(inMemoryOrderAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete an order that does not exist', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const newOrder = makeOrder({}, new UniqueEntityId('order-01'));

    await inMemoryOrdersRepository.create(newOrder);

    inMemoryOrderAttachmentsRepository.items.push(
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    );

    const result = await sut.execute({
      userId: 'user-01',
      orderId: 'order-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete an order without admin role', async () => {
    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const newOrder = makeOrder({}, new UniqueEntityId('order-01'));

    await inMemoryOrdersRepository.create(newOrder);

    inMemoryOrderAttachmentsRepository.items.push(
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    );

    const result = await sut.execute({
      userId: 'user-01',
      orderId: 'order-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
