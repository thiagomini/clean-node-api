import { InvalidParamException } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols'
import { EmailValidationError } from '@/validation/validators'
import { EmailValidation } from '@/validation/validators/email.validation'
import { createEmailValidatorStub } from '../mocks'

describe('EmaiLValidation', () => {
  describe('validate', () => {
    it('should call EmailValidator with correct value', () => {
      const { sut, emailValidatorStub } = createSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

      sut.validate({
        email: 'any_mail@mail.com',
      })

      expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
    })
  })

  it('should return InvalidParamException if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = createSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const response = sut.validate({
      email: 'any_mail@mail.com',
    })

    expect(response).toEqual(new InvalidParamException('email'))
  })

  it('should return undefined if EmailValidator returns true', () => {
    const { sut } = createSut()

    const response = sut.validate({
      email: 'any_mail@mail.com',
    })

    expect(response).toBeUndefined()
  })

  it('should throw EmailValidationError if EmailValidator throws an error', () => {
    const { sut, emailValidatorStub } = createSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(() =>
      sut.validate({
        email: 'any_mail@mail.com',
      })
    ).toThrowError(EmailValidationError)
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
    sut,
  }
}
