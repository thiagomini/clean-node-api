export class ExistingEmailException extends Error {
  constructor(email: string) {
    super(`The received email ${email} is already in use`)
    this.name = ExistingEmailException.name
  }
}
