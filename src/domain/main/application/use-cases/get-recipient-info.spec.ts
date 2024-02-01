import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { GetRecipientInfoUseCase } from './get-recipient-info';
import { makeRecipient } from 'test/factories/make-recipient';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/core/enum/user-role.enum';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryRecipientRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: GetRecipientInfoUseCase;

describe('Get Recipient Info Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new GetRecipientInfoUseCase(
      inMemoryRecipientRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to get recipient info by id', async () => {
    await inMemoryRecipientRepository.create(
      makeRecipient({}, new UniqueEntityId('recipient-01')),
    );

    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-01',
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be able to get recipient info from a recipient that does not exist', async () => {
    await inMemoryRecipientRepository.create(
      makeRecipient({}, new UniqueEntityId('recipient-01')),
    );

    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to get recipient info without admin role', async () => {
    await inMemoryRecipientRepository.create(
      makeRecipient({}, new UniqueEntityId('recipient-01')),
    );

    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
