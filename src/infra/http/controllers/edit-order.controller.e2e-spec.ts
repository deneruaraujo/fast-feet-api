import { UserRole } from '@/core/enum/user-role.enum';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { OrderFactory } from 'test/factories/make-order';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';

describe('Edit order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /orders/:id', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.Admin,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const order = await orderFactory.makePrismaOrder({
      userId: user.id.toString(),
    });

    const orderId = order.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'new name',
        isAvailableForPickup: true,
        hasBeenPickedUp: false,
        hasBeenDelivered: false,
        hasBeenReturned: false,
      });

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        name: 'new name',
        isAvailableForPickup: true,
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
