import { Middleware } from 'redux'
import isEqual from 'lodash.isequal'
import { MEMO } from './utils'

interface Throttles {
  [key: string]: unknown
}

const throttles: Throttles = {}

export function throttleActionsMiddleware(time = 60): Middleware {
  return () => (next) => (action) => {
    if (typeof action.payload === 'function') {
      const {
        type,
        meta,
        meta: { memoOptions },
      } = action

      if (!(memoOptions && memoOptions[MEMO])) {
        return next(action)
      }

      const cacheAction = { type, meta }
      const { key } = memoOptions

      if (throttles[key] && isEqual(throttles[key], cacheAction)) {
        return
      }

      throttles[key] = cacheAction

      const newAction = {
        ...action,
        payload: action.payload(),
      }

      setTimeout(() => {
        delete throttles[key]
      }, memoOptions?.ttl ?? time)

      next(newAction)
    } else {
      next(action)
    }
  }
}
