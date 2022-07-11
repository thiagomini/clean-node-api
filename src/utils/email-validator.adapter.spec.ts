import { EmailValidatorAdapter } from './email-validator.adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    expect(sut.isValid('invalid_email@mail.com')).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()

    expect(sut.isValid('valid_email@mail.com')).toBe(true)
  })
})
