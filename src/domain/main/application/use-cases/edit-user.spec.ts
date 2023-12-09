import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { EditUserUseCase } from './edit-user';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/core/enum/user-role.enum';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: EditUserUseCase;

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new EditUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to edit a user', async () => {
    const newUser = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(newUser);

    const result = await sut.execute({
      userId: 'user-01',
      name: 'New name',
      ssn: '123-45-6789',
      password: 'newPassword123',
      role: UserRole.Deliveryman,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it('should not be able to edit without admin role', async () => {
    const newUser = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(newUser);

    const result = await sut.execute({
      userId: 'user-01',
      name: 'New name',
      ssn: '123-45-6789',
      password: 'newPassword123',
      role: UserRole.Deliveryman,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit a user that does not exist', async () => {
    const newUser = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(newUser);

    const result = await sut.execute({
      userId: 'user-02',
      name: 'New name',
      ssn: '123-45-6789',
      password: 'newPassword123',
      role: UserRole.Deliveryman,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
