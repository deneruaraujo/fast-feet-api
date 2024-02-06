import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from '@/domain/main/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { RecipientsRepository } from '@/domain/main/application/repositories/recipients-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';
import { OrdersRepository } from '@/domain/main/application/repositories/orders-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { OrderAttachmentsRepository } from '@/domain/main/application/repositories/order-attachments-repository';
import { PrismaOrderAttachmentsRepository } from './prisma/repositories/prisma-order-attachments-repository';

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
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: OrderAttachmentsRepository,
      useClass: PrismaOrderAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    RecipientsRepository,
    OrdersRepository,
    OrderAttachmentsRepository,
  ],
})
export class DatabaseModule {}
