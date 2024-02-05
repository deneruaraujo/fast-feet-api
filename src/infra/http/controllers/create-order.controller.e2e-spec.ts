import { UserRole } from '@/core/enum/user-role.enum';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';

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

test('[POST] /orders', async () => {
  const user = await userFactory.makePrismaUser({
    role: UserRole.Admin,
  });

  const accessToken = jwt.sign({ sub: user.id.toString() });

  const response = await request(app.getHttpServer())
    .post('/orders')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: 'New Order',
      isAvailableForPickup: true,
      hasBeenPickedUp: false,
      hasBeenDelivered: false,
      hasBeenReturned: false,
    });

  expect(response.statusCode).toBe(201);

  const orderOnDatabase = await prisma.order.findFirst({
    where: {
      name: 'New Order',
    },
  });

  expect(orderOnDatabase).toBeTruthy();
});
