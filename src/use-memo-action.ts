import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isPromise from 'is-promise'
import get from 'lodash.get'
import { MEMO, objectToString } from './utils'

interface ActionMeta {
  [key: string]: unknown
}

interface PayloadArgs {
  [key: string]: unknown
}

export interface ActionBase {
  type: string
}

interface ActionObject<T = unknown, A extends PayloadArgs = PayloadArgs> extends ActionBase {
  payload: ((args: A) => T | Promise<T>) | unknown
  meta?: ActionMeta
}

type Action<T, A extends PayloadArgs> = (() => ActionObject<T, A>) | ActionObject<T, A>

interface MetaReturn {
  storePath: string
}

interface Return<T = unknown> {
  data: T
  error: string | boolean
  status: boolean
  meta: MetaReturn
}

interface Options {
  key: string
  ttl?: number
}

interface MemoOptions {
  key: string
  ttl?: number
  args: PayloadArgs
  [MEMO]: boolean
}

export function useMemoAction<T, A extends PayloadArgs = PayloadArgs>(
  action: Action<T, A>,
  options: Options,
  args: A = {} as A
): Return<T> {
  const dispatch = useDispatch()
  const { key: keyOption, ttl } = options
  const { type, payload, meta } = typeof action === 'function' ? action() : action

  let key = keyOption

  if (Object.keys(args).length !== 0) {
    key = `${key}:${objectToString(args)}`
  }

  const path = `memo.${key}`
  const storeData = useSelector((state) => get(state, path))

  const memoOptions: MemoOptions = { key, ttl, args, [MEMO]: true }

  const modifyAction: ActionObject = {
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
