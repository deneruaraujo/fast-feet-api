import { UserRole } from '@/core/enum/user-role.enum';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';

describe('Get User Info (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /users/:id', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'User 01',
      role: UserRole.Admin,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const userId = user.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      user: expect.objectContaining({ name: 'User 01' }),
    });
  });
});
