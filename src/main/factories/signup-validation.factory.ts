import { CompareFieldsValidation } from '../../presentation/validators/compare-fields.validation'
import { EmailValidation } from '../../presentation/validators/email.validation'
import { RequiredFieldValidation } from '../../presentation/validators/required-field.validation'
import { ValidationComposite } from '../../presentation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../utils'

export const createValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation(['name', 'email', 'password', 'passwordConfirmation'])
  const passwordConfirmationCompareValidation = new CompareFieldsValidation('password', 'passwordConfirmation')
  const emailValidation = createEmailValidation()

  return new ValidationComposite([requiredFieldsValidation, passwordConfirmationCompareValidation, emailValidation])
}

const createEmailValidation = (): EmailValidation => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new EmailValidation('email', emailValidatorAdapter)
}
