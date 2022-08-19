import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isPromise from 'is-promise'
import get from 'lodash.get'

export interface Action {
  type: string
  payload: unknown | (() => unknown | Promise<unknown>)
  meta?: object
}

export type UseMemoActionAction = ((...args: unknown[]) => Action) | Action

export interface UseMemoActionOptions {
  key: string
  ttl?: number
}

export interface UseMemoActionReturn {
  data: any
  error: string | false
  status: boolean
  meta: {
    storePath: string
  }
}

type MemoOptions = Pick<UseMemoActionOptions, 'key' | 'ttl'>

export function useMemoAction(
  action: UseMemoActionAction,
  { key, ttl }: UseMemoActionOptions
): UseMemoActionReturn {
  const dispatch = useDispatch()
  const { type, payload, meta } = typeof action === 'function' ? action() : action
  const path = `memo.${key}`
  const storeData = useSelector((state) => get(state, path))
  const memoOptions: MemoOptions = { key }

  if (ttl !== undefined) {
    memoOptions.ttl = ttl
  }

  const modifyAction = {
    type: `${type}/${key}`,
    payload,
    meta: { ...meta, memoOptions },
  }

  React.useEffect(() => {
    dispatch(modifyAction)
  }, [])

  const error = storeData instanceof Error ? storeData.message : false
  const status = !!error

  let data

  if (!(isPromise(storeData) || error)) {
    data = storeData
  }

  return {
    data,
    error,
    status,
    meta: {
      storePath: path,
    },
  }
}
