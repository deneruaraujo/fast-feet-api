import { User } from '../../enterprise/entities/user';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findBySSN(ssn: string): Promise<User | null>;
  abstract save(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
}
