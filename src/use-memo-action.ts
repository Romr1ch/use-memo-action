import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isPromise from 'is-promise'
import get from 'lodash.get'
import { MEMO, objectToString } from './utils'

export interface Action<T = unknown> {
  type: string
  payload?: unknown | ((args: object) => T | Promise<T>)
  meta?: object
}

export type UseMemoActionAction<T = unknown> = (() => Action<T>) | Action<T>

export interface UseMemoActionOptions {
  key: string
  ttl?: number
}

export interface UseMemoActionArgs {
  [key: string]: any
}

export interface UseMemoActionReturn<T = any> {
  data: T
  error: string | boolean
  status: boolean
  meta: {
    storePath: string
  }
}

type MemoOptions = {
  args: UseMemoActionArgs
  [MEMO]: boolean
} & Pick<UseMemoActionOptions, 'key' | 'ttl'>

export function useMemoAction<T>(
  action: UseMemoActionAction,
  options: UseMemoActionOptions,
  args: UseMemoActionArgs = {}
): UseMemoActionReturn<T> {
  const dispatch = useDispatch()
  const { key: keyOption, ttl } = options
  const { type, payload, meta } = typeof action === 'function' ? action() : action

  let key = keyOption

  if (Object.keys(args).length !== 0) {
    key += `:${objectToString(args)}`
  }

  const path = `memo.${key}`
  const storeData = useSelector((state) => get(state, path))

  const memoOptions: MemoOptions = { key, ttl, args, [MEMO]: true }

  const modifyAction = {
    type: `@@memo/${type}/${keyOption}`,
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
