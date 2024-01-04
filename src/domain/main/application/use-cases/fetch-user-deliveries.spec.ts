import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FetchUserDeliveriesUseCase } from './fetch-user-deliveries';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeOrder } from 'test/factories/make-order';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let sut: FetchUserDeliveriesUseCase;

describe('Fetch User Deliveries', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    sut = new FetchUserDeliveriesUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch user deliveries', async () => {
    await inMemoryUsersRepository.create(
      makeUser({}, new UniqueEntityId('user-01')),
    );

    await inMemoryOrdersRepository.create(
      makeOrder(
        {
          hasBeenDelivered: true,
          userId: 'user-01',
        },
        new UniqueEntityId('order-01'),
      ),
    );
    await inMemoryOrdersRepository.create(
      makeOrder(
        {
          hasBeenDelivered: true,
          userId: 'user-01',
        },
        new UniqueEntityId('order-02'),
      ),
    );
    await inMemoryOrdersRepository.create(
      makeOrder(
        {
          hasBeenDelivered: false,
        },
        new UniqueEntityId('order-03'),
      ),
    );

    const result = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.orders).toHaveLength(2);
  });

  it('should be able to fetch paginated user deliveries', async () => {
    await inMemoryUsersRepository.create(
      makeUser({}, new UniqueEntityId('user-01')),
    );

    for (let i = 1; i <= 23; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder(
          {
            hasBeenDelivered: true,
            userId: 'user-01',
          },
          new UniqueEntityId('order-01'),
        ),
      );
    }

    const result = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.orders).toHaveLength(3);
  });
});
