import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { OrderFactory } from 'test/factories/make-order';
import { RecipientFactory } from 'test/factories/make-recipient';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';

describe('Fetch Nearby Orders (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /orders', async () => {
    const user = await userFactory.makePrismaUser({});

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const recipient01 = await recipientFactory.makePrismaRecipient({
      userId: user.id.toString(),
      name: 'Near Order/recipient 01', // named just for identification
      latitude: 35.9046205,
      longitude: 137.9888759,
    });

    const recipient02 = await recipientFactory.makePrismaRecipient({
      userId: user.id.toString(),
      name: 'Near Order/recipient 02', // named just for identification
      latitude: 35.9046205,
      longitude: 137.9888759,
    });

    const recipient03 = await recipientFactory.makePrismaRecipient({
      userId: user.id.toString(),
      name: 'Far Order/recipient', // named just for identification
      latitude: -27.0610928,
      longitude: -49.5229501,
    });

    await Promise.all([
      orderFactory.makePrismaOrder({
        userId: user.id.toString(),
        name: 'Near Order/recipient 01', // named just for identification
        recipient: recipient01,
      }),

      orderFactory.makePrismaOrder({
        userId: user.id.toString(),
        name: 'Near Order/recipient 02', // named just for identification
        recipient: recipient02,
      }),

      orderFactory.makePrismaOrder({
        userId: user.id.toString(),
        name: 'Far Order/recipient', // named just for identification
        recipient: recipient03,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/orders')
      .query({
        latitude: 35.9046205,
        longitude: 137.9888759,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({ name: 'Near Order/recipient 01' }),
        expect.objectContaining({ name: 'Near Order/recipient 02' }),
      ]),
    });
  });
});
