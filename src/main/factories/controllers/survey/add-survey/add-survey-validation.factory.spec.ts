import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validators'
import { createAddSurveyValidation } from './add-survey-validation.factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidationFactory', () => {
  it('should call validation composite with all validations', () => {
    createAddSurveyValidation()

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation(['question', 'answers'])
    ])
  })
})
