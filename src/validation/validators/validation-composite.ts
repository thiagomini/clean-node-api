import { Optional } from '../../utils'
import { Validation } from '../../presentation/protocols/validation'
import { ValidationError } from './validation.error'

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}
  validate(input: unknown): Optional<Error> {
    try {
      return this.validateWithEachValidation(input)
    } catch (error) {
      throw new ValidationError({
        cause: error as Error,
        context: {
          input,
        },
      })
    }
  }

  private validateWithEachValidation(input: unknown): Optional<Error> {
    for (const validation of this.validations) {
      const errorOrUndefined = validation.validate(input)
      if (errorOrUndefined) {
        return errorOrUndefined
      }
    }
  }
}
