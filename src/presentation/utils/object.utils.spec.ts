import { pick } from './object.utils'

describe('Object utils', () => {
  describe('pick', () => {
    it('should pick a single attribute', () => {
      const object = {
        key: 'value',
        key2: 'value2'
      }

      expect(pick(object, 'key')).toEqual({ key: 'value' })
    })

    it('should pick multiple attributes', () => {
      const object = {
        key: 'value',
        key2: 'value2'
      }

      expect(pick(object, 'key', 'key2')).toEqual(object)
    })
  })
})
