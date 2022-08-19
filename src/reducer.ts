import set from 'lodash.set'

interface State {
  [key: string]: any
}

interface MemoOption {
  key?: string
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

  if (!memoOptions) {
    return state
  }

  return set({ ...state }, memoOptions?.key || 'none', action.payload)
}
