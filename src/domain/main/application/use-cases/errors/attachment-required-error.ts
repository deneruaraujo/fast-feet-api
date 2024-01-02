import { UseCaseError } from '@/core/errors/use-case-error';

export class AttachmentRequiredError extends Error implements UseCaseError {
  constructor() {
    super(`Please attach at least one image.`);
  }
}
