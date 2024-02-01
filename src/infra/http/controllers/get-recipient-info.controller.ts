import { GetRecipientInfoUseCase } from '@/domain/main/application/use-cases/get-recipient-info';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { RecipientPresenter } from '../presenters/recipient-presenter';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/recipients/:id')
export class GetRecipientInfoController {
  constructor(private getRecipientInfo: GetRecipientInfoUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') recipientId: string,
  ) {
    const userId = user.sub;

    const result = await this.getRecipientInfo.execute({
      recipientId,
      userId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { recipient: RecipientPresenter.toHTTP(result.value.recipient) };
  }
}
