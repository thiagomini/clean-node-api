import { Optional } from '../../utils'
import { InvalidParamException } from '../errors'
import { Validation } from '../protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly fieldToCompare: string) {

  }

  validate (input: Record<string, any>): Optional<Error> {
    if (!input) return

    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamException(this.fieldToCompare)
    }
  }
}
