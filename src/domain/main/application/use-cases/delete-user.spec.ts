import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { DeleteUserUseCase } from './delete-user';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserRole } from '@/core/enum/user-role.enum';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: DeleteUserUseCase;

describe('Delete User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new DeleteUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to delete a user', async () => {
    const newUser = makeUser(
      {
        role: UserRole.Admin,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(newUser);

    await sut.execute({
      userId: 'user-01',
    });

    expect(inMemoryUsersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a user without admin role', async () => {
    const newUser = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(newUser);

    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryUsersRepository.items).toHaveLength(1);
  });

  it('should not be able to delete a user that does not exist', async () => {
    const newUser = makeUser(
      {
        role: UserRole.Deliveryman,
      },
      new UniqueEntityId('user-01'),
    );

    await inMemoryUsersRepository.create(newUser);

    const result = await sut.execute({
      userId: 'user-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryUsersRepository.items).toHaveLength(1);
  });
});
