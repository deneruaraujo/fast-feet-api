import { UserRole } from 'src/core/enum/user-role.enum';
import { Either, right } from 'src/core/either';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';

interface RegisterUserUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
  role: UserRole;
}

type RegisterUserUseCaseResponse = Either<
  null,
  {
    user: User;
  }
>;

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
      role,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
