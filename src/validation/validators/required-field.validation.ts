import { MissingParamException } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { firstMissingAttributeOf } from '@/presentation/utils'
import { Optional } from '@/utils'

export class RequiredFieldValidation implements Validation {
  constructor(private readonly requiredFields: string[]) {}

  validate(input: unknown): Optional<Error> {
    const missingAttribute = firstMissingAttributeOf(input, this.requiredFields)

    if (missingAttribute) {
      return new MissingParamException(missingAttribute)
    }
  }
}
