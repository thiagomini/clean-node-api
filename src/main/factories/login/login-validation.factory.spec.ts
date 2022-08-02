import { EmailValidator } from '../../../presentation/protocols'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../presentation/validators'
import { createValidation } from './login-validation.factory'

jest.mock('../../../presentation/validators/validation-composite')

describe('LoginValidationFactory', () => {
  it('should call validation composite with all validations', () => {
    createValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation(['email', 'password']),
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
