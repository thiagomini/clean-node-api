import { EmailValidator } from '../../../presentation/protocols'
import { CompareFieldsValidation } from '../../../presentation/validators/compare-fields.validation'
import { EmailValidation } from '../../../presentation/validators/email.validation'
import { RequiredFieldValidation } from '../../../presentation/validators/required-field.validation'
import { ValidationComposite } from '../../../presentation/validators/validation-composite'
import { createValidation } from './signup-validation.factory'

jest.mock('../../../presentation/validators/validation-composite')

describe('SignupValidationFactory', () => {
  it('should call validation composite with all validations', () => {
    createValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation(['name', 'email', 'password', 'passwordConfirmation']),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', createEmailValidatorStub())
    ])
  })
})

const createEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
