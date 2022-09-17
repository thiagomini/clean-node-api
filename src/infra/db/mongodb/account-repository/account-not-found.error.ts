export class AccountNotFoundError extends Error {
  constructor(id: string) {
    super(`Could not find account with id ${id}`)
    this.name = AccountNotFoundError.name
  }
}
