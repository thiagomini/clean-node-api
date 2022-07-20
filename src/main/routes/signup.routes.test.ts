import request from 'supertest'
import app from '../config/app'

describe('signup routes', () => {
  describe('signup', () => {
    it('should return an account on success', async () => {
      await request(app).post('/api/signup').send({
        name: 'Thiago',
        email: 'thiago@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(200)
    })
  })
})
