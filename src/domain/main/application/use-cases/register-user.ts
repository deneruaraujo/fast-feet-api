import { UserRole } from 'src/core/enum/user-role.enum';
import { Either, left, right } from 'src/core/either';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUserUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
  role: UserRole;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
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
    const userWithSameCPF = await this.usersRepository.findByCPF(cpf);

    if (userWithSameCPF) {
      return left(new UserAlreadyExistsError(cpf));
    }

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
