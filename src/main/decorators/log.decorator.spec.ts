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
    it('should return the same result of the decorated controller', async () => {
      const {
        sut
      } = createSut()

      const request: HttpRequest = {
        body: {}
      }

      const response = await sut.handle(request)

      expect(response).toEqual(getStubControllerResponse())
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
    async handle (): Promise<HttpResponse> {
      return getStubControllerResponse()
    }
  }

  return new StubController()
}

const getStubControllerResponse = (): HttpResponse => ({
  body: {
    key: 'value'
  },
  statusCode: HttpStatusCodes.OK
})
