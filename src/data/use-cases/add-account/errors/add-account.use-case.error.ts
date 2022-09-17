import { ContextError, ContextErrorInput } from '../../../../errors'

export type AddAccountUseCaseErrorInput = Pick<
  ContextErrorInput,
  'cause' | 'context'
>

export class AddAccountUseCaseError extends ContextError {
  constructor(errorInput: AddAccountUseCaseErrorInput) {
    super({
      message: 'An Error occurred while trying to add an account',
      errorName: AddAccountUseCaseError.name,
      ...errorInput,
    })
  }
}
