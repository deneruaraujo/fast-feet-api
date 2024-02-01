import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import { UserRole } from '@/core/enum/user-role.enum';

describe('Create Recipient (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /recipient', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.Admin,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jane Smith',
        state: 'ST',
        city: 'Anytown',
        street: 'Oak Lane',
        number: '456',
        zipCode: '54321',
        latitude: 35.8709495,
        longitude: 137.9809247,
        user: user,
      });

    expect(response.statusCode).toBe(201);

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'Jane Smith',
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
  });
});
