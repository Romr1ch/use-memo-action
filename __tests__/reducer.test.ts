import { memoReducer, MemoOptions } from '../src/reducer'
import { MEMO } from '../src/utils'

describe('reducer', () => {
  test('successful adding data only from hook', () => {
    const action = {
      type: '@@memo/USER/user',
      payload: {
        name: 'Username',
        age: 42,
      },
      meta: {
        memoOptions: {
          key: 'user',
          [MEMO]: true,
        },
      },
    }

    expect(memoReducer({}, action)).toEqual({
      [action.meta.memoOptions.key]: action.payload,
    })
  })

  test('other action without adding', () => {
    const action = {
      type: 'OTHER_ACTION',
      payload: 42,
    }

    expect(memoReducer({}, action)).toEqual({})
  })

  test('failed attempt to replace hook action', () => {
    const action = {
      type: '@@memo/USER/42',
      payload: 42,
      meta: {
        memoOptions: {
          key: 'user',
        } as MemoOptions,
      },
    }

    expect(memoReducer({}, action)).toEqual({})
  })
})
