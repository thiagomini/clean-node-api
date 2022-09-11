import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'
import { getFirstDefinedResponse } from '../../utils/array-utils'

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
    const errorOrUndefined = getFirstDefinedResponse(inputs, validation.validate.bind(validation))

    return errorOrUndefined as Optional<Error>
  }
}
