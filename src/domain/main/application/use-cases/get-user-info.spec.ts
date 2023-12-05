import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { GetUserInfoUseCase } from './get-user-info';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UserRole } from '@/core/enum/user-role.enum';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: GetUserInfoUseCase;

describe('Get User Info Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new GetUserInfoUseCase(inMemoryUsersRepository);
  });

  it('should be able to get user info by id', async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          role: UserRole.Admin,
        },
        new UniqueEntityId('user-01'),
      ),
    );

    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be able to get user info without ADMIN role', async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          role: UserRole.Deliveryman,
        },
        new UniqueEntityId('user-01'),
      ),
    );

    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('Should not be able to get user info with wrong id', async () => {
    await inMemoryUsersRepository.create(
      makeUser(
        {
          role: UserRole.Admin,
        },
        new UniqueEntityId('user-01'),
      ),
    );

    const result = await sut.execute({
      userId: 'user-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
