export class InvalidTokenError extends Error {
  constructor(token: string) {
    super(`Given token ${token} is invalid`)
    this.name = InvalidTokenError.name
  }
}
