import { MEMO } from './utils'

interface State {
  [key: string]: any
}

interface MemoOption {
  key: string
  [MEMO]: boolean
}

interface Meta {
  memoOptions?: MemoOption
}

interface ReducerAction {
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
