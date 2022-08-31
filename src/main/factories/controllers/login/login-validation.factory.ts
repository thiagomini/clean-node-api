import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../presentation/validators'
import { EmailValidatorAdapter } from '../../../adapters/email-validator.adapter'

export const createLoginValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation(['email', 'password'])
  const emailValidation = createEmailValidation()

  return new ValidationComposite([requiredFieldsValidation, emailValidation])
}

const createEmailValidation = (): EmailValidation => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new EmailValidation('email', emailValidatorAdapter)
}
