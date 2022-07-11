import { EmailValidatorAdapter } from './email-validator.adapter'

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    expect(sut.isValid('invalid_email@mail.com')).toBe(false)
  })
})
