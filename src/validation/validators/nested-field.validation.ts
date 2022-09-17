import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'

export class NestedFieldValidation implements Validation {
  constructor(
    private readonly nestedObjectKey: string,
    private readonly validators: Validation[]
  ) {}

  validate(input: Record<string, any>): Optional<Error> {
    for (const validation of this.validators) {
      const errorOrUndefined = validation.validate(input[this.nestedObjectKey])
      if (errorOrUndefined) {
        return errorOrUndefined
      }
    }
  }
}
