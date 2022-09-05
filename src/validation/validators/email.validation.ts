import { Optional } from '../../utils'
import { EmailValidator } from '../protocols'
import { EmailValidationError } from './email-validation.error'
import { Validation } from '../../presentation/protocols/validation'
import { InvalidParamException } from '../../presentation/errors'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

  validate (input: Record<string, any>): Optional<Error> {
    try {
      return this.validateEmail(input)
    } catch (err) {
      const email = input?.[this.fieldName]
      throw new EmailValidationError({
        email,
        cause: err as Error,
        context: {
          email,
          fieldName: this.fieldName
        }
      })
    }
  }

  private validateEmail (input: Record<string, any>): Optional<Error> {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamException(this.fieldName)
    }
    return undefined
  }
}
