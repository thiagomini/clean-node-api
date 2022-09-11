import { EachValidation, NestedFieldValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'

export const createAddSurveyValidation = (): ValidationComposite => {
  const requiredFieldsValidation = new RequiredFieldValidation([
    'question',
    'answers'
  ])

  const nestedFieldValidation = new NestedFieldValidation('answers', [
    new EachValidation([
      new RequiredFieldValidation(['answer'])
    ])
  ])

  return new ValidationComposite([requiredFieldsValidation, nestedFieldValidation])
}
