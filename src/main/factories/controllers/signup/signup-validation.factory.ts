import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
} from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator.adapter'

export const createSignupValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation([
    'name',
    'email',
    'password',
    'passwordConfirmation',
  ])
  const passwordConfirmationCompareValidation = new CompareFieldsValidation(
    'password',
    'passwordConfirmation'
  )
  const emailValidation = createEmailValidation()

  return new ValidationComposite([
    requiredFieldsValidation,
    passwordConfirmationCompareValidation,
    emailValidation,
  ])
}

const createEmailValidation = (): EmailValidation => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new EmailValidation('email', emailValidatorAdapter)
}
