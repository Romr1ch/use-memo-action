import { MEMO } from './utils'

interface State {
  [key: string]: unknown
}

export interface MemoOptions {
  key: string
  [MEMO]: boolean
}

interface Meta {
  memoOptions?: MemoOptions
}

interface ReducerAction {
  type: string
  payload: unknown
  meta?: Meta
}

const initialState: State = {}

export function memoReducer(state = initialState, action: ReducerAction) {
  const memoOptions = action?.meta?.memoOptions

  if (memoOptions && memoOptions[MEMO]) {
    return {
      ...state,
      [memoOptions.key]: action.payload,
    }
  }

  return state
}
