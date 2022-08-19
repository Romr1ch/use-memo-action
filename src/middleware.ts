import { Middleware, AnyAction } from 'redux'
import isEqual from 'lodash.isequal'

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

      const cacheAction = { type, meta }

      if (throttles[type] && isEqual(throttles[type], cacheAction)) {
        return
      }

      throttles[type] = cacheAction

      action.payload = action.payload(memoOptions?.args)

      setTimeout(() => {
        delete throttles[type]
      }, memoOptions?.ttl ?? time)

      next(action)
    } else {
      next(action)
    }
  }
}
