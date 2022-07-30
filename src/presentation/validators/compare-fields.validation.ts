import { Optional } from '../../utils'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldToCompare: string) {

  }

  validate (input: unknown): Optional<Error> {
    return undefined
  }
}
