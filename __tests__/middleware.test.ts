import { Store } from 'redux'
import { throttleActionsMiddleware } from '../src'
import { ActionBase } from '../src'
import { MEMO } from '../src/utils'

describe('middleware', () => {
  const next = jest.fn()

  const middleware = (action: ActionBase, time?: number) =>
    throttleActionsMiddleware(time)({} as Store)(next)(action)

  afterEach(() => {
    next.mockReset()
  })

  test('call common action', () => {
    const action = { type: 'TEST' }

    middleware(action)

    expect(next).toHaveBeenCalledWith(action)
  })

  test('call an action belonging to the hook', () => {
    const payload = jest.fn(() => new Promise<string>((r) => r('ok')))

    const action = {
      type: '@@memo/USER/user',
      payload,
      meta: {
        memoOptions: {
          key: 'user',
          [MEMO]: true,
        },
      },
    }

    middleware(action)

    expect(next).toHaveBeenCalledTimes(1)
    expect(payload).toHaveBeenCalledTimes(1)
  })

  test('one call many identical actions in N time', () => {
    const payload = jest.fn(() => new Promise<string>((res) => res('ok')))

    const action = {
      type: '@@memo/TODOS/todos',
      payload,
      meta: {
        memoOptions: {
          key: 'todo',
          [MEMO]: true,
        },
      },
    }

    for (let i = 0; i < 5; i++) {
      middleware(action)
    }

    expect(next).toHaveBeenCalledTimes(1)
    expect(payload).toHaveBeenCalledTimes(1)
  })

  test('call is equal to called identical action after N time', () => {
    const payload = jest.fn(() => new Promise<string>((res) => res('ok')))

    const action = {
      type: '@@memo/POSTS/posts',
      payload,
      meta: {
        memoOptions: {
          key: 'posts',
          [MEMO]: true,
        },
      },
    }

    middleware(action, 10)

    return new Promise((res) => {
      setTimeout(() => {
        middleware(action)

        res(expect(next).toHaveBeenCalledTimes(2))
      }, 20)
    })
  })
})
