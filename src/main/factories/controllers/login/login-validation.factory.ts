import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation,
} from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators'

export const createLoginValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation([
    'email',
    'password',
  ])
  const emailValidation = createEmailValidation()

  return new ValidationComposite([requiredFieldsValidation, emailValidation])
}

const createEmailValidation = (): EmailValidation => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new EmailValidation('email', emailValidatorAdapter)
}
