import { UserRole } from 'src/core/enum/user-role.enum';
import { Either, left, right } from 'src/core/either';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { Injectable } from '@nestjs/common';

interface RegisterUserUseCaseRequest {
  name: string;
  ssn: string;
  password: string;
  role: UserRole;
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;
@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    ssn,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameSSN = await this.usersRepository.findBySSN(ssn);

    if (userWithSameSSN) {
      return left(new UserAlreadyExistsError(ssn));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      ssn,
      password: hashedPassword,
      role,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
