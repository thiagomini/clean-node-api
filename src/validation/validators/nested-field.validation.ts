import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'

export class NestedFieldValidation implements Validation {
  constructor (private readonly nestedObjectKey: string, validators: Validation[]) {}

  validate (_input: unknown): Optional<Error> {
    return undefined
  }
}
