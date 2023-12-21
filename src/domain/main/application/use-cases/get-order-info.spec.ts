import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { GetOrderInfoUseCase } from './get-order-info';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/core/enum/user-role.enum';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeOrder } from 'test/factories/make-order';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;

let sut: GetOrderInfoUseCase;

describe('Get Order Info Use Case', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );

    sut = new GetOrderInfoUseCase(inMemoryOrdersRepository);
  });

  it('should be able to get a order info by id', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryOrdersRepository.create(
      makeOrder({}, new UniqueEntityId('order-01')),
    );

    const result = await sut.execute({
      orderId: 'order-01',
      user: user,
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be able to get a order that does not exist', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryOrdersRepository.create(
      makeOrder({}, new UniqueEntityId('order-01')),
    );

    const result = await sut.execute({
      orderId: 'order-02',
      user: user,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to get a order without admin role', async () => {
    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryOrdersRepository.create(
      makeOrder({}, new UniqueEntityId('order-01')),
    );

    const result = await sut.execute({
      orderId: 'order-01',
      user: user,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
