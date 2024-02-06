import { UserRole } from '@/core/enum/user-role.enum';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { OrderFactory } from 'test/factories/make-order';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';

describe('Get Order Info (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /orders/:id', async () => {
    const user = await userFactory.makePrismaUser({
      role: UserRole.Admin,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const order = await orderFactory.makePrismaOrder({
      userId: user.id.toString(),
      name: 'Order 01',
    });

    const orderId = order.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      order: expect.objectContaining({ name: 'Order 01' }),
    });
  });
});
