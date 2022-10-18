import {
  InvalidSurveyAnswerError,
  InvalidSurveyAnswerErrorInput,
} from './invalid-survey-answer.error'

describe('InvalidSurveyAnswerError', () => {
  it('should return an error message containing the valid answers separated by a comma', () => {
    const errorInput: InvalidSurveyAnswerErrorInput = {
      answer: 'wrong_answer',
      answers: [
        {
          answer: 'valid_answer_1',
        },
        {
          answer: 'valid_answer_2',
        },
      ],
    }

    const error = new InvalidSurveyAnswerError(errorInput)

    expect(error.message).toBe(
      "Survey answer 'wrong_answer' is invalid. Please provide one of the following values: [valid_answer_1, valid_answer_2]"
    )
  })
})
