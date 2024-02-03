import { GetUserInfoUseCase } from '@/domain/main/application/use-cases/get-user-info';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { UserPresenter } from '../presenters/user-presenter';

@Controller('/users/:id')
export class GetUserInfoController {
  constructor(private getUserInfo: GetUserInfoUseCase) {}

  @Get()
  async handle(@Param('id') userId: string) {
    const result = await this.getUserInfo.execute({
      userId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { user: UserPresenter.toHTTP(result.value.user) };
  }
}
