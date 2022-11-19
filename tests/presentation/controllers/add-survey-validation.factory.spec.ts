import {
  ValidationComposite,
  RequiredFieldValidation,
  NestedFieldValidation,
  EachValidation,
} from '@/validation/validators'
import { createAddSurveyValidation } from '@/main/factories/controllers/survey/add-survey/add-survey-validation.factory'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidationFactory', () => {
  it('should call validation composite with all validations', () => {
    createAddSurveyValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation(['question', 'answers']),
      new NestedFieldValidation('answers', [
        new EachValidation([new RequiredFieldValidation(['answer'])]),
      ]),
    ])
  })
})
