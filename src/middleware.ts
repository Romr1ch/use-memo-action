import { Middleware, AnyAction } from 'redux'
import isEqual from 'lodash.isequal'
import { MEMO } from './utils'

interface Throttles {
  [key: string]: any
}

const throttles: Throttles = {}

// eslint-disable-next-line @typescript-eslint/ban-types
export function throttleActionsMiddleware(time = 60): Middleware<{}, AnyAction> {
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
        payload: action.payload(memoOptions?.args || {}),
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
