import { HttpRequest, Validation, Optional } from './add-survey-controller.protocols'
import { AddSurveyController } from './add-survey.controller'
describe('AddSurveyController', () => {
  it('should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (): Optional<Error> {
        return undefined
      }
    }
    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = new AddSurveyController(validationStub)
    const httpRequest = createFakeRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})

const createFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})
