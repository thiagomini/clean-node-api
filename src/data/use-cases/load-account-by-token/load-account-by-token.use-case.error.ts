import { ContextError, ContextErrorInput } from '../../../errors'

export type LoadAccountByTokenUseCaseErrorInput = Pick<
  ContextErrorInput,
  'cause'
> & {
  accessToken: string
}

export class LoadAccountByTokenUseCaseError extends ContextError {
  constructor(errorInput: LoadAccountByTokenUseCaseErrorInput) {
    super({
      message: 'An Error occurred while trying to load an account by token',
      errorName: LoadAccountByTokenUseCaseError.name,
      cause: errorInput.cause,
      context: {
        accessToken: errorInput.accessToken,
      },
    })
  }
}
