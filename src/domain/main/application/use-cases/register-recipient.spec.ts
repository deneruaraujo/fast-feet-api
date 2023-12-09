import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { RegisterRecipientUseCase } from './register-recipient';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: RegisterRecipientUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new RegisterRecipientUseCase(inMemoryRecipientRepository);
  });

  it('should be able to register a new recipient', async () => {
    const result = await sut.execute({
      name: 'Jane Smith',
      state: 'ST',
      city: 'Anytown',
      street: 'Oak Lane',
      number: '456',
      zipCode: '54321',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    });
  });
});
