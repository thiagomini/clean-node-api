import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'

export class EachValidation implements Validation {
  constructor (private readonly validators: Validation[]) {}

  validate (input: unknown): Optional<Error> {
    for (const validation of this.validators) {
      const errorOrUndefined = validation.validate(input)
      if (errorOrUndefined) {
        return errorOrUndefined
      }
    }
  }
}
