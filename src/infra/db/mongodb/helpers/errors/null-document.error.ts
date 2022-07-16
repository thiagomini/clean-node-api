import { ContextError } from '../../../../../errors'

export class NullDocumentError extends ContextError {
  constructor () {
    super({
      message: 'Cannot insert id in document: expected an object but received undefined',
      errorName: NullDocumentError.name
    })
  }
}
