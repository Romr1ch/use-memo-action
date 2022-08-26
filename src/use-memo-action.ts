import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isPromise from 'is-promise'
import get from 'lodash.get'
import { MEMO, objectToString } from './utils'

export interface ActionBase {
  type: string
}

interface MetaReturn {
  storePath: string
}

export interface Return<T> {
  data: T
  error: string | boolean
  status: boolean
  meta: MetaReturn
}

export interface Options<A> {
  args?: A
  ttl?: number
}

interface MemoOptions {
  key: string
  ttl?: number
  args: object
  [MEMO]: boolean
}

export type Payload<T> = () => T

export function useMemoAction<T, A extends object = object>(
  // TODO: Написать тип
  action: any,
  options: Options<A> = {}
): Return<T> {
  const dispatch = useDispatch()
  const { args = {}, ttl } = options
  const { type, payload, meta } = action(args)

  let key = type

  if (Object.keys(args).length) {
    key = `${key}:${objectToString(args)}`
  }

  const path = `memo.${key}`
  const storeData = useSelector((state) => get(state, path))

  const memoOptions: MemoOptions = { key, ttl, args, [MEMO]: true }

  const modifyAction = {
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
