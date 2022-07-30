import { RequiredFieldValidation } from '../../presentation/validators/required-field.validation'
import { ValidationComposite } from '../../presentation/validators/validation-composite'

export const createValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation(['name', 'email', 'password', 'passwordConfirmation'])

  return new ValidationComposite([requiredFieldsValidation])
}
