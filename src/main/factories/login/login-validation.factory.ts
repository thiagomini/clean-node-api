import { EmailValidation } from '../../../presentation/validators/email.validation'
import { RequiredFieldValidation } from '../../../presentation/validators/required-field.validation'
import { ValidationComposite } from '../../../presentation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils'

export const createValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation(['email', 'password'])
  const emailValidation = createEmailValidation()

  return new ValidationComposite([requiredFieldsValidation, emailValidation])
}

const createEmailValidation = (): EmailValidation => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new EmailValidation('email', emailValidatorAdapter)
}
