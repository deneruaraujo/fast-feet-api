import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { Encrypter } from '../cryptography/encrypter';
import { AuthenticateUserUseCase } from './authenticate-user';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let encrypter: Encrypter;

let sut: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      encrypter,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      ssn: '123-45-6789',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      ssn: '123-45-6789',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
