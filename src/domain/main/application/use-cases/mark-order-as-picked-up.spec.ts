import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { MarkOrderAsPickedUpUseCase } from './mark-order-as-picked-up';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeOrder } from 'test/factories/make-order';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;

let sut: MarkOrderAsPickedUpUseCase;

describe('Mark Order As Picked Up', () => {
  inMemoryOrderAttachmentsRepository = new InMemoryOrderAttachmentsRepository();
  inMemoryOrdersRepository = new InMemoryOrdersRepository(
    inMemoryOrderAttachmentsRepository,
  );

  sut = new MarkOrderAsPickedUpUseCase(inMemoryOrdersRepository);

  it('should be able to mark an order as picked up', async () => {
    const newOrder = makeOrder(
      {
        userId: 'user-01',
        hasBeenPickedUp: false,
      },
      new UniqueEntityId('order-01'),
    );

    await inMemoryOrdersRepository.create(newOrder);

    const result = await sut.execute({
      orderId: 'order-01',
      userId: 'user-01',
      hasBeenPickedUp: true,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    });
  });

  it('should not be able to pickup an order that does not exist', async () => {
    const newOrder = makeOrder(
      {
        userId: 'user-01',
        hasBeenPickedUp: false,
      },
      new UniqueEntityId('order-01'),
    );

    await inMemoryOrdersRepository.create(newOrder);

    const result = await sut.execute({
      orderId: 'order-02',
      userId: 'user-01',
      hasBeenPickedUp: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to pickup an order from another user', async () => {
    const newOrder = makeOrder(
      {
        userId: 'user-01',
        hasBeenPickedUp: false,
      },
      new UniqueEntityId('order-01'),
    );

    await inMemoryOrdersRepository.create(newOrder);

    const result = await sut.execute({
      orderId: 'order-01',
      userId: 'user-02',
      hasBeenPickedUp: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
