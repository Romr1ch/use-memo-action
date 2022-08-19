# use-memo-action

React hook for action redux memoization.

## Установка

```
npm i @romr1ch/use-memo-action
```

## Пример использования

### Подключение `middlewares` и `reducer`.

> **Важно!** Мидлвара `throttleActionsMiddleware` работает вместе с `enchantAsyncActionsMiddleware`.
> Установите `npm i redux-enchant-async-actions`, если это ещё не сделано.

```typescript jsx
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension'
import { memoReducer, throttleActionsMiddleware } from '@romr1ch/use-memo-action'
import enchantAsyncActionsMiddleware from 'redux-enchant-async-actions'

const rootReducer = combineReducers({
  // `memo` — обязательное название
  memo: memoReducer,
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(throttleActionsMiddleware(), enchantAsyncActionsMiddleware))
)
```

### Использование

```typescript jsx
import React from 'react'
import { Provider } from 'react-redux'
import { createAction } from 'redux-actions'

const getTodo = createAction('GET_TODO', () => {
  return async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/1`)

    return await response.json()
  }
})

export function ComponentA() {
  const { data, error, status, meta } = useMemoAction(getTodo, { key: 'todo' })

  return <h1>ComponentA</h1>
}

export function ComponentB() {
  useMemoAction(getTodo, { key: 'todo' })

  return <h1>ComponentB</h1>
}

export function ComponentC() {
  useMemoAction(getTodo, { key: 'todo' })

  return <h1>ComponentC</h1>
}

function App() {
  return (
    <Provider store={store}>
      <ComponentA />
      <ComponentB />
      <ComponentC />
    </Provider>
  )
}
```

## throttleActionsMiddleware

### Опция

| Аргумент | Тип    | По умолчанию | Описание                                                                                                            |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| time     | number | 60           | Устанавливается значение в **милисикундах**. Одни и те же экшены не будут отрабатывать за этот промержуток времени. |

## useMemoAction

### Опции

| Аргумент  | Тип                                           | По умолчанию | Описание                                                                                                                                                                                   |
| --------- | --------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| action\*  | UseMemoActionAction                           | -            | Может передаваться либо функцией, либо объектом, у которого `payload` должен возвращать функцию, которая ничего не принимает и возвращает `Promise`. Здесь можно делать запросы к серверу. |
| options\* | [UseMemoActionOptions](#UseMemoActionOptions) | -            | Второй аргумент принимает объект, в котором необходимо передать ключ с уникальным значением (`{ key: 'unic-value' }`).                                                                     |

### Возвращает

| Аргумент | Тип                   | По умолчанию | Описание                                                                   |
| -------- | --------------------- | ------------ | -------------------------------------------------------------------------- |
| data     | any                   | undefined    | Результат экшена, если будет установлена ошибка, то `undefined`.           |
| error    | string или false      | false        | Текст ошибки или `false`, если её нет.                                     |
| status   | boolean               | -            | Зависит от `error`.                                                        |
| meta     | { storePath: string } | -            | Единственным свойством является `storePath` — путь для данных к хранилищу. |

## UseMemoActionOptions

| Свойство | Тип    | По умолчанию | Описание                                                                                                                                                      |
| -------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key\*    | string | -            | Уникальное значение, под котором будут храниться данные в хранилище.                                                                                          |
| ttl      | number | 60           | Устанавливает время, нахождении в кэше для конкретного экшена. Значение можно установить [глобально](#throttleActionsMiddleware) для всех хуков в приложении. |
