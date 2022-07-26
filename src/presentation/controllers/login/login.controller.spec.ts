import { MissingParamException } from '../../errors'
import { badRequest, HttpRequest } from '../../protocols'
import { LoginController } from './login.controller'

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamException('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = createSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamException('password')))
  })
})

interface SutFactoryResponse {
  sut: LoginController
}

const createSut = (): SutFactoryResponse => {
  const sut = new LoginController()
  return {
    sut
  }
}
