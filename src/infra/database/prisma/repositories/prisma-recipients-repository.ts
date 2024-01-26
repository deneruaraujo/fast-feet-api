import { RecipientsRepository } from '@/domain/main/application/repositories/recipients-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Recipient } from '@/domain/main/enterprise/entities/recipient';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.update({
      where: {
        id: recipient.id.toString(),
      },
      data,
    });
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    });
  }
}
