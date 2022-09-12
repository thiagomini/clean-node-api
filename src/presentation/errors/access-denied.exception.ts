export class AccessDeniedException extends Error {
  constructor () {
    super('Access denied')
    this.name = AccessDeniedException.name
  }
}
