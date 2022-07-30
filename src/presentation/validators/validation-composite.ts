import { Optional } from '../../utils'
import { Validation } from './validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}
  validate (input: unknown): Optional<Error> {
    for (const validation of this.validations) {
      const errorOrUndefined = validation.validate(input)
      if (errorOrUndefined) {
        return errorOrUndefined
      }
    }
  }
}
