import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { EditRecipientUseCase } from './edit-recipient';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/core/enum/user-role.enum';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeRecipient } from 'test/factories/make-recipient';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryRecipientRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: EditRecipientUseCase;

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new EditRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to edit a recipient', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const newRecipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    await inMemoryRecipientRepository.create(newRecipient);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-01',
      name: 'new name',
      state: 'new state',
      city: 'new city',
      street: 'new street',
      number: 'new number',
      zipCode: 'new zipcode',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    });
  });

  it('should not be able to edit a recipient that does not exist', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const newRecipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    await inMemoryRecipientRepository.create(newRecipient);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-02',
      name: 'new name',
      state: 'new state',
      city: 'new city',
      street: 'new street',
      number: 'new number',
      zipCode: 'new zipcode',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a recipient without admin role', async () => {
    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const newRecipient = makeRecipient({}, new UniqueEntityId('recipient-01'));

    await inMemoryRecipientRepository.create(newRecipient);

    const result = await sut.execute({
      userId: 'user-01',
      recipientId: 'recipient-01',
      name: 'new name',
      state: 'new state',
      city: 'new city',
      street: 'new street',
      number: 'new number',
      zipCode: 'new zipcode',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
