import { InMemoryOrderAttachmentsRepository } from './../../../../../test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { CreateOrderUseCase } from './create-order';
import { UserRole } from '@/core/enum/user-role.enum';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeRecipient } from 'test/factories/make-recipient';
import { makeUser } from 'test/factories/make-user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );
    sut = new CreateOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to create an order', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    const recipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    const result = await sut.execute({
      deliverymanId: '1',
      recipient: recipient,
      isAvailableForPickup: false,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
      attachmentsIds: ['1', '2'],
      user: user,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    });
    expect(
      inMemoryOrdersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryOrdersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ]);
  });

  it('should not be able to create an order without admin role', async () => {
    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    const recipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    const result = await sut.execute({
      deliverymanId: '1',
      recipient: recipient,
      isAvailableForPickup: false,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
      attachmentsIds: ['1', '2'],
      user: user,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
