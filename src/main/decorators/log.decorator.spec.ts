import { Controller, HttpRequest, HttpResponse, HttpStatusCodes } from '../../presentation/protocols'
import { LogDecoratorController } from './log.decorator'

describe('LogDecorator', () => {
  describe('handle', () => {
    it('should call the decorated controller handle function', async () => {
      const {
        sut,
        stubController
      } = createSut()

      const handleSpy = jest.spyOn(stubController, 'handle')
      const request: HttpRequest = {
        body: {}
      }

      await sut.handle(request)

      expect(handleSpy).toHaveBeenCalledWith(request)
    })
  })
})

interface SutFactoryResponse {
  sut: LogDecoratorController
  stubController: Controller
}

const createSut = (): SutFactoryResponse => {
  const stubController = createStubController()
  const sut = new LogDecoratorController(stubController)

  return {
    sut,
    stubController
  }
}

const createStubController = (): Controller => {
  class StubController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return {
        body: {},
        statusCode: HttpStatusCodes.OK
      }
    }
  }

  return new StubController()
}
