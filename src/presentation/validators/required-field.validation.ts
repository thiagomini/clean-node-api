import { Optional } from '../../utils'
import { MissingParamException } from '../errors'
import { firstMissingAttributeOf } from '../utils'
import { Validation } from '../protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly requiredFields: string[]) {}

  validate (input: unknown): Optional<Error> {
    const missingAttribute = firstMissingAttributeOf(input, this.requiredFields)

    if (missingAttribute) {
      return new MissingParamException(missingAttribute)
    }
  }
}
