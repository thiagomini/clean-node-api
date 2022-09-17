export class AccountByTokenNotFoundError extends Error {
  constructor(token: string) {
    super(`Account with token '${token}' not found.`)
    this.name = AccountByTokenNotFoundError.name
  }
}
