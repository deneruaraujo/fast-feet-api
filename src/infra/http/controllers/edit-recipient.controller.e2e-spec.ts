import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { RecipientFactory } from 'test/factories/make-recipient';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { UserRole } from '@/core/enum/user-role.enum';

describe('Edit Recipient (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /recipients/:id', async () => {
    const user = await userFactory.makePrismaUser();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const recipient = await recipientFactory.makePrismaRecipient();

    const recipientId = recipient.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New name',
        state: 'New state',
        city: 'New city',
        street: 'New street',
        number: '123',
        zipCode: '12345',
        latitude: 35.8709495,
        longitude: 137.9809247,
        user: { role: UserRole.Admin },
      });

    expect(response.statusCode).toBe(204);

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'New name',
        state: 'New state',
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
  });
});
