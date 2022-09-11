import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'

export class EachValidation implements Validation {
  constructor (private readonly validators: Validation[]) {}

  validate (input: any[]): Optional<Error> {
    for (const validation of this.validators) {
      const errorOrUndefined = input.reduce((_, inputToValidate) => {
        const maybeError = validation.validate(inputToValidate)
        return maybeError
      }, undefined)
      if (errorOrUndefined) {
        return errorOrUndefined
      }
    }
  }
}
