import { Store } from 'redux'
import { Action, throttleActionsMiddleware } from '../src'
import { MEMO } from '../src/utils'

describe('middleware', () => {
  const create = () => {
    const next = jest.fn()

    const middleware = (action: Action, time?: number) =>
      throttleActionsMiddleware(time)({} as Store)(next)(action)

    return { middleware, next }
  }

  test('call common action', () => {
    const { middleware, next } = create()

    const action = { type: 'TEST' }

    middleware(action)

    expect(next).toHaveBeenCalledWith(action)
  })

  test('call an action belonging to the hook', () => {
    const { middleware, next } = create()

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

  test('call payload function with parameter passing', () => {
    const { middleware, next } = create()

    const payload = jest.fn<Promise<string>, { id: number }[]>(
      ({ id = 1 }) => new Promise<string>((res) => res(`/api/users/${id}`))
    )

    const action = {
      type: '@@memo/USER/user',
      payload,
      meta: {
        memoOptions: {
          key: 'user:{id:1}',
          args: { id: 1 },
          [MEMO]: true,
        },
      },
    }

    middleware(action)

    expect(next).toHaveBeenCalledTimes(1)
    expect(payload).toHaveBeenCalledTimes(1)

    const [[args]] = payload.mock.calls

    expect(action.meta.memoOptions.args).toEqual(args)
  })

  test('one call many identical actions in N time', () => {
    const { middleware, next } = create()

    const payload = jest.fn(() => new Promise<string>((res) => res('ok')))

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

    for (let i = 0; i < 5; i++) {
      middleware(action)
    }

    expect(next).toHaveBeenCalledTimes(1)
    expect(payload).toHaveBeenCalledTimes(1)
  })

  test('call is equal to called identical action after N time', () => {
    const { middleware, next } = create()

    const payload = jest.fn(() => new Promise<string>((res) => res('ok')))

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

    middleware(action, 10)

    return new Promise((res) => {
      setTimeout(() => {
        middleware(action)

        res(expect(next).toHaveBeenCalledTimes(2))
      }, 20)
    })
  })
})
