import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isPromise from 'is-promise'
import get from 'lodash.get'
import { MEMO, objectToString } from './utils'

interface ActionMeta {
  [key: string]: unknown
}

export interface ActionBase {
  type: string
}

export interface ActionObject<T = unknown, A extends object = object> extends ActionBase {
  payload: ((args: A) => T | Promise<T>) | unknown
  meta?: ActionMeta
}

export type Action<T, A extends object> = (() => ActionObject<T, A>) | ActionObject<T, A>

interface MetaReturn {
  storePath: string
}

export interface Return<T = unknown> {
  data: T
  error: string | boolean
  status: boolean
  meta: MetaReturn
}

export interface Options<A extends object = object> {
  args?: A
  ttl?: number
}

interface MemoOptions {
  key: string
  ttl?: number
  args: object
  [MEMO]: boolean
}

export function useMemoAction<T, A extends object = object>(
  action: Action<T, A>,
  options: Options<A> = {}
): Return<T> {
  const dispatch = useDispatch()
  const { args = {}, ttl } = options
  const { type, payload, meta } = typeof action === 'function' ? action() : action

  let key = type

  if (Object.keys(args).length) {
    key = `${key}:${objectToString(args)}`
  }

  const path = `memo.${key}`
  const storeData = useSelector((state) => get(state, path))

  const memoOptions: MemoOptions = { key, ttl, args, [MEMO]: true }

  const modifyAction: ActionObject = {
    type: `@@memo/${type}`,
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
