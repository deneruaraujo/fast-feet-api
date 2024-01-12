import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';
import { SpyInstance } from 'vitest';
import { OnMarkedAsPickedUp } from './on-marked-as-picked-up';
import { makeOrder } from 'test/factories/make-order';
import { makeRecipient } from 'test/factories/make-recipient';
import { waitFor } from 'test/utils/wait-for';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Order Marked As Picked Up', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository();

    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentsRepository,
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnMarkedAsPickedUp(inMemoryOrdersRepository, sendNotificationUseCase);
  });

  it('should be able to send a notification when order is marked as picked up', async () => {
    const recipient = makeRecipient();
    const order = makeOrder({ hasBeenPickedUp: false, recipient: recipient });

    inMemoryRecipientsRepository.create(recipient);
    inMemoryOrdersRepository.create(order);

    order.hasBeenPickedUp = true;

    inMemoryOrdersRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
