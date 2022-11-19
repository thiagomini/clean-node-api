import request from 'supertest'
import app from '@/main/config/app'

describe('CORS middleware', () => {
  describe('should enable CORS', () => {
    app.get('/test_cors', (req, res) => {
      res.send(req.body)
    })

    it('should parse the request body as json', async () => {
      await request(app)
        .get('/test_cors')
        .expect('access-control-allow-origin', '*')
        .expect('access-control-allow-methods', '*')
        .expect('access-control-allow-headers', '*')
    })
  })
})
