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
