import { UsersRepository } from 'src/domain/main/application/repositories/users-repository';
import { User } from 'src/domain/main/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findBySSN(ssn: string) {
    const user = this.items.find((item) => item.ssn === ssn);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User) {
    this.items.push(user);
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items[itemIndex] = user;
  }

  async delete(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);

    this.items.splice(itemIndex, 1);
  }
}
