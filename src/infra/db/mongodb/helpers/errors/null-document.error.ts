import { ContextError } from '../../../../../errors'

export class NullDocumentError extends ContextError {
  constructor (object: null | undefined) {
    super({
      message: `Cannot insert id in document: expected an object but received ${String(object)}`,
      errorName: NullDocumentError.name
    })
  }
}
