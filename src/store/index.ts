// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { configureStore, combineReducers, type Middleware, isRejectedWithValue } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import usersReduser, { UserApi } from './users'

const unauthenticatedMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action) &&
    (action.payload?.status === 400 || action.payload?.status === 401 || action.payload?.status === 403)) {
    localStorage.removeItem('token')
    window.location.reload()
  }
  return next(action)
}

const reducers = {
  users: usersReduser,
  [UserApi.reducerPath]: UserApi.reducer
}

const rootReducer = combineReducers<typeof reducers>(reducers)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(UserApi.middleware)
      .concat(unauthenticatedMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)
