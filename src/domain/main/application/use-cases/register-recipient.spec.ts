import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { RegisterRecipientUseCase } from './register-recipient';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserRole } from '@/core/enum/user-role.enum';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryRecipientRepository: InMemoryRecipientsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: RegisterRecipientUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new RegisterRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to register a new recipient', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: 'user-01',
      name: 'Jane Smith',
      state: 'ST',
      city: 'Anytown',
      street: 'Oak Lane',
      number: '456',
      zipCode: '54321',
      latitude: 35.8709495,
      longitude: 137.9809247,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    });
  });

  it('should not be able to register a new recipient without admin role', async () => {
    const user = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: 'user-01',
      name: 'Jane Smith',
      state: 'ST',
      city: 'Anytown',
      street: 'Oak Lane',
      number: '456',
      zipCode: '54321',
      latitude: 35.8709495,
      longitude: 137.9809247,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
