import { InvalidParamException } from '../errors'
import { EmailValidator } from '../protocols'
import { EmailValidation } from './email.validation'

describe('EmaiLValidation', () => {
  describe('validate', () => {
    it('should call EmailValidator with correct value', () => {
      const { sut, emailValidatorStub } = createSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

      sut.validate({
        email: 'any_mail@mail.com'
      })

      expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
  })

  it('should return InvalidParamException if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = createSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const response = sut.validate({
      email: 'any_mail@mail.com'
    })

    expect(response).toEqual(new InvalidParamException('email'))
  })
})

interface SutFactoryResponse {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const createSut = (): SutFactoryResponse => {
  const emailValidatorStub = createEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    emailValidatorStub,
    sut
  }
}

const createEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}
