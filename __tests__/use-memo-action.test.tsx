import { renderHook } from '@testing-library/react'
import { createAction } from 'redux-actions'
import * as reduxHooks from 'react-redux'
import { useMemoAction, Return } from '../src'

const todo = { id: 1, title: 'Test', completed: false }

const addTodo = createAction('ADD_TODO', () => {
  return () => {
    return new Promise((res) => {
      const wait = setTimeout(() => {
        clearTimeout(wait)
        res(todo)
      }, 0)
    })
  }
})

jest.mock('react-redux')

describe('useMemoAction', () => {
  it('should call dispatch and return data', () => {
    const dispatch = jest.fn()

    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(dispatch)
    jest.spyOn(reduxHooks, 'useSelector').mockReturnValue(todo)

    const { result } = renderHook(() => useMemoAction(addTodo))

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(result.current).toEqual({
      data: todo,
      error: false,
      status: false,
      meta: {
        storePath: 'memo.ADD_TODO'
      }
    } as Return<typeof todo>)
  })
})
