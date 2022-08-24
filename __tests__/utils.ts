import { objectToString } from '../src/utils'

describe('objectToString', () => {
  test('correct conversion to string', () => {
    expect(objectToString({ name: 'Username', ids: [1, 2, 3], path: 'to.path[0].test' })).toEqual(
      '{name:Username,ids:1,2,3,path:topath0test}'
    )
    expect(objectToString({ test: Symbol('test'), null: null })).toEqual('{null:null}')
  })
})
