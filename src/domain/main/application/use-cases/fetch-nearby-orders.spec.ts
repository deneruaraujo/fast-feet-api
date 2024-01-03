import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders';
import { makeOrder } from 'test/factories/make-order';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { makeRecipient } from 'test/factories/make-recipient';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;

let sut: FetchNearbyOrdersUseCase;

describe('Fetch Nearby Orders Use Case', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch nearby orders', async () => {
    await inMemoryUsersRepository.create(
      makeUser({}, new UniqueEntityId('user-01')),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Near Order/recipient', // named just for identification
          latitude: 35.9046205,
          longitude: 137.9888759,
        },
        new UniqueEntityId('recipient-01'),
      ),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Near Order/recipient', // named just for identification
          latitude: 35.9046205,
          longitude: 137.9888759,
        },
        new UniqueEntityId('recipient-01'),
      ),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Far Order/recipient', // named just for identification
          latitude: -27.0610928,
          longitude: -49.5229501,
        },
        new UniqueEntityId('recipient-02'),
      ),
    );

    await inMemoryOrdersRepository.create(
      makeOrder(
        {
          userId: 'user-01',
          recipient: inMemoryRecipientsRepository.items[0],
        },
        new UniqueEntityId('order-01'),
      ),
    );

    await inMemoryOrdersRepository.create(
      makeOrder(
        {
          userId: 'user-01',
          recipient: inMemoryRecipientsRepository.items[1],
        },
        new UniqueEntityId('order-02'),
      ),
    );

    const result = await sut.execute({
      userId: 'user-01',
      userLatitude: 35.8709495,
      userLongitude: 137.9809247,
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.orders).toHaveLength(2);
  });

  it('should be able to fetch paginated nearby orders', async () => {
    await inMemoryUsersRepository.create(
      makeUser({}, new UniqueEntityId('user-01')),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Near Order/recipient', // named just for identification
          latitude: 35.9046205,
          longitude: 137.9888759,
        },
        new UniqueEntityId('recipient-01'),
      ),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Near Order/recipient', // named just for identification
          latitude: 35.9046205,
          longitude: 137.9888759,
        },
        new UniqueEntityId('recipient-01'),
      ),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Far Order/recipient', // named just for identification
          latitude: -27.0610928,
          longitude: -49.5229501,
        },
        new UniqueEntityId('recipient-02'),
      ),
    );

    for (let i = 1; i <= 23; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder(
          {
            userId: 'user-01',
            recipient: inMemoryRecipientsRepository.items[0],
          },
          new UniqueEntityId('order-01'),
        ),
      );
    }

    const result = await sut.execute({
      userId: 'user-01',
      userLatitude: 35.8709495,
      userLongitude: 137.9809247,
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.orders).toHaveLength(3);
  });

  it('should not be able to fetch nearby orders from another user', async () => {
    await inMemoryUsersRepository.create(
      makeUser({}, new UniqueEntityId('user-01')),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Near Order/recipient', // named just for identification
          latitude: 35.9046205,
          longitude: 137.9888759,
        },
        new UniqueEntityId('recipient-01'),
      ),
    );

    await inMemoryRecipientsRepository.create(
      makeRecipient(
        {
          name: 'Far Order/recipient', // named just for identification
          latitude: -27.0610928,
          longitude: -49.5229501,
        },
        new UniqueEntityId('recipient-02'),
      ),
    );

    await inMemoryOrdersRepository.create(
      makeOrder(
        {
          userId: 'user-01',
          recipient: inMemoryRecipientsRepository.items[0],
        },
        new UniqueEntityId('order-01'),
      ),
    );

    await inMemoryOrdersRepository.create(
      makeOrder(
        {
          userId: 'user-01',
          recipient: inMemoryRecipientsRepository.items[1],
        },
        new UniqueEntityId('order-02'),
      ),
    );

    const result = await sut.execute({
      userId: 'user-02',
      userLatitude: 35.8709495,
      userLongitude: 137.9809247,
      page: 1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBe(null);
  });
});
