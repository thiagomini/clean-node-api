import request from 'supertest'
import app from '../config/app'

describe('No Cache Middleware', () => {
  app.get('/test_cache_middleware', (req, res) => {
    res.send({ hello: 'cache' })
  })

  it('should parse the request body as json', async () => {
    await request(app)
      .get('/test_cache_middleware')
      .expect(
        'cache-control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      )
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
