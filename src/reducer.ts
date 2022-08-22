import { MEMO } from './utils'

export interface State {
  [key: string]: any
}

export interface MemoOptions {
  key: string
  [MEMO]: boolean
}

export interface Meta {
  memoOptions?: MemoOptions
}

export interface ReducerAction {
  type: string
  payload: any
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
