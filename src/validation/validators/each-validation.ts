import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'

export class EachValidation implements Validation {
  constructor (private readonly validators: Validation[]) {}

  validate (inputs: any[]): Optional<Error> {
    for (const validation of this.validators) {
      const errorOrUndefined = this.validateEachInputWithValidation(inputs, validation)
      if (errorOrUndefined) {
        return errorOrUndefined
      }
    }
  }

  private validateEachInputWithValidation (inputs: any[], validation: Validation): Optional<Error> {
    const errorOrUndefined = inputs.reduce((_, inputToValidate) => {
      const maybeError = validation.validate(inputToValidate)
      return maybeError
    }, undefined)

    return errorOrUndefined
  }
}
