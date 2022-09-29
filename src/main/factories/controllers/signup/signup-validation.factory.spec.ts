import { EmailValidator } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators'
import { createSignupValidation } from './signup-validation.factory'

jest.mock('@/validation/validators/validation-composite')

describe('SignupValidationFactory', () => {
  it('should call validation composite with all validations', () => {
    createSignupValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation([
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', createEmailValidatorStub()),
    ])
  })
})

const createEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
