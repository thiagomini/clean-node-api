import { EmailValidator } from '@/validation/protocols'

export const createEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
