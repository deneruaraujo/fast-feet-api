import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { DeleteRecipientUseCase } from './delete-recipient';
import { makeRecipient } from 'test/factories/make-recipient';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserRole } from '@/core/enum/user-role.enum';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: DeleteRecipientUseCase;

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new DeleteRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to delete a recipient', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const recipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    await inMemoryRecipientsRepository.create(recipient);

    await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-01',
    });

    expect(inMemoryRecipientsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a recipient without admin role', async () => {
    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const recipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryRecipientsRepository.items).toHaveLength(1);
  });

  it('should not be able to delete a recipient that does not exist', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const recipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryRecipientsRepository.items).toHaveLength(1);
  });
});
