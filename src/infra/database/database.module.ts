import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from '@/domain/main/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { RecipientsRepository } from '@/domain/main/application/repositories/recipients-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, RecipientsRepository],
})
export class DatabaseModule {}
