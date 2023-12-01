import { UsersRepository } from 'src/domain/main/application/repositories/users-repository';
import { User } from 'src/domain/main/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User) {
    this.items.push(user);
  }
}
