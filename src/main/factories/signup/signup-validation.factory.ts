import { RequiredFieldValidation, CompareFieldsValidation, EmailValidation, ValidationComposite } from '../../../presentation/validators'
import { EmailValidatorAdapter } from '../../adapters/email-validator.adapter'

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
