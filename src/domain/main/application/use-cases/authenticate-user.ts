import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';

interface AuthenticateUserUseCaseRequest {
  ssn: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encryper: Encrypter,
  ) {}

  async execute({
    ssn,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findBySSN(ssn);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encryper.encrypt({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
