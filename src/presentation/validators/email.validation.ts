import { Optional } from '../../utils'
import { EmailValidator } from '../protocols'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

  validate (input: Record<string, any>): Optional<Error> {
    this.emailValidator.isValid(input[this.fieldName])
    return undefined
  }
}
