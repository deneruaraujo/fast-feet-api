import { User } from '@/domain/main/enterprise/entities/user';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      ssn: user.ssn,
      password: user.password,
      role: user.role,
    };
  }
}
