import React, { useCallback, useLayoutEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import { useAuthWatchDog } from 'src/hooks/auth'

const Routes = () => {
  const [auth, setAuth] = useState('')
  const [refresh, setRefresh] = useState(0)

  useLayoutEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('name')
    if (token ?? name) {
      token && setAuth(token)
      name && setAuth(name)
    } else {
      setAuth('')
    }
  }, [])

  const afterLogin = useCallback(() => {
    setRefresh((old) => old + 1)
  }, [])

  const afterLogout = useCallback(() => {
    setRefresh((old) => old + 1)
  }, [])

  useAuthWatchDog(afterLogin, afterLogout)

  return (
    <BrowserRouter>{auth ? <PrivateRoutes key={refresh} /> : <PublicRoutes key={refresh} />}</BrowserRouter>
  )
}
export default Routes
