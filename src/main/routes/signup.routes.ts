import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (_req, res) => {
    res.json({
      ok: 'ok'
    })
  })
}
