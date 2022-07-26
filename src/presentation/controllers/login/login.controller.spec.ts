import { MissingParamException } from '../../errors'
import { badRequest, HttpRequest } from '../../protocols'
import { LoginController } from './login.controller'

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamException('email')))
  })
})
