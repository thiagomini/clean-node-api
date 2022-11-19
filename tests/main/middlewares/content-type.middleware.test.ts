import request from 'supertest'
import app from '@/main/config/app'

describe('Content Type middleware', () => {
  it('should return the content-type as json', async () => {
    app.get('/test_content_type', (_req, res) => {
      res.send('')
    })

    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  it('should return the content-type as xml when forced', async () => {
    app.get('/test_content_type_forced', (_req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type_forced')
      .expect('content-type', /xml/)
  })
})
