import { UserRole } from 'src/core/enum/user-role.enum';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { RegisterUserUseCase } from './register-user';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: RegisterUserUseCase;

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123-456-789-00',
      password: '123456',
      role: UserRole.Deliveryman,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it('Should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123-456-789-00',
      password: '123456',
      role: UserRole.Deliveryman,
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });

  it('Should not be able to register with the same CPF', async () => {
    const cpf = '123-456-789-00';

    await inMemoryUsersRepository.create(
      makeUser(
        {
          cpf,
        },
        new UniqueEntityId('user-01'),
      ),
    );

    const result = await sut.execute({
      name: 'John Doe',
      cpf,
      password: '123456',
      role: UserRole.Deliveryman,
    });

    console.log(result);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
