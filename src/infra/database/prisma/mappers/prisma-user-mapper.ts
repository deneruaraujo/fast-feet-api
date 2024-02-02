import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserRole } from '@/core/enum/user-role.enum';
import { User } from '@/domain/main/enterprise/entities/user';
import { User as PrismaUser, Prisma } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        ssn: raw.ssn,
        password: raw.password,
        role:
          raw.role === UserRole.Admin ? UserRole.Admin : UserRole.Deliveryman,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      ssn: user.ssn,
      password: user.password,
      role: user.role,
    };
  }
}
