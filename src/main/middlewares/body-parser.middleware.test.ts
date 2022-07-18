import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  app.post('/test_body_parser', (req, res) => {
    res.send(req.body)
  })

  it('should parse the request body as json', async () => {
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Thiago' })
      .expect({ name: 'Thiago' })
  })
})
