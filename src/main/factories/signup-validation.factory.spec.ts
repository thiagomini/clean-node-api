import { CompareFieldsValidation } from '../../presentation/validators/compare-fields.validation'
import { RequiredFieldValidation } from '../../presentation/validators/required-field.validation'
import { ValidationComposite } from '../../presentation/validators/validation-composite'
import { createValidation } from './signup-validation.factory'

jest.mock('../../presentation/validators/validation-composite')

describe('SignupValidationFactory', () => {
  it('should call validation composite with all validations', () => {
    createValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation(['name', 'email', 'password', 'passwordConfirmation']),
      new CompareFieldsValidation('password', 'passwordConfirmation')
    ])
  })
})
