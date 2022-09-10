import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'

export const createAddSurveyValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation([
    'question',
    'answers'
  ])

  return new ValidationComposite([requiredFieldsValidation])
}
