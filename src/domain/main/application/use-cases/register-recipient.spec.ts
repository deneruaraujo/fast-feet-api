import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { RegisterRecipientUseCase } from './register-recipient';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserRole } from '@/core/enum/user-role.enum';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryRecipientRepository: InMemoryRecipientsRepository;
let sut: RegisterRecipientUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientsRepository();
    sut = new RegisterRecipientUseCase(inMemoryRecipientRepository);
  });

  it('should be able to register a new recipient', async () => {
    const user = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'Jane Smith',
      state: 'ST',
      city: 'Anytown',
      street: 'Oak Lane',
      number: '456',
      zipCode: '54321',
      latitude: 35.8709495,
      longitude: 137.9809247,
      user: user,
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

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'Jane Smith',
      state: 'ST',
      city: 'Anytown',
      street: 'Oak Lane',
      number: '456',
      zipCode: '54321',
      latitude: 35.8709495,
      longitude: 137.9809247,
      user: user,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
