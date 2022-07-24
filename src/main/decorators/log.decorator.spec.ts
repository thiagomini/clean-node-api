import { LogRepository } from '../../data/protocols'
import { Controller, HttpRequest, HttpResponse, HttpStatusCodes, internalServerError } from '../../presentation/protocols'
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
    it('should call LogRepository when controller returns serverError', async () => {
      const {
        sut,
        stubLogRepository,
        stubController
      } = createSut()

      const thrownError = internalServerError(new Error('something wrong happened'))
      jest.spyOn(stubController, 'handle').mockResolvedValueOnce(thrownError)

      const logSpy = jest.spyOn(stubLogRepository, 'error')
      const request: HttpRequest = {
        body: {}
      }

      await sut.handle(request)

      expect(logSpy).toHaveBeenCalledWith(thrownError.body)
    })
  })
})

interface SutFactoryResponse {
  sut: LogDecoratorController
  stubController: Controller
  stubLogRepository: LogRepository
}

const createSut = (): SutFactoryResponse => {
  const stubController = createStubController()
  const stubLogRepository = createStubLogRepository()
  const sut = new LogDecoratorController(stubController, stubLogRepository)

  return {
    sut,
    stubController,
    stubLogRepository
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

const createStubLogRepository = (): LogRepository => {
  class StubLogRepository implements LogRepository {
    async error (): Promise<void> {
    }
  }

  return new StubLogRepository()
}
