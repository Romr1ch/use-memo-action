export { useMemoAction } from './use-memo-action'
export { throttleActionsMiddleware } from './middleware'
export { memoReducer } from './reducer'

export type Payload<T = unknown, A extends object = object> = (args: A) => T
