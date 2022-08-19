export const MEMO = Symbol('MEMO')

export function objectToString(obj = {}) {
  return JSON.stringify(obj).replace(/"/g, '')
}
