import React, { Suspense } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../constants/RouteConstants'
import { ProtectedRoute } from '../components/protected-routes/ProtectedRoute'
import { Loader } from '../components/ui/loader/Loader'

const LoginLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../pages/login/Login'))
})

const ForgetPasswordLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../pages/forget-password/ForgetPassword'))
})

const ResetLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../pages/reset/Reset'))
})

const LayoutLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../pages/layout/Layout'))
})

const PassportAuth = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../pages/login/passportLogin'))
})

export const RouterConfig: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={ROUTE_CONSTANTS.SOCIAL_AUTH}
          render={() => (
            <Suspense fallback={<Loader loaderHeight="calc(100vh - 10px)" />}>
              <PassportAuth />
            </Suspense>
          )}
        ></Route>

        <Route
          exact
          path={ROUTE_CONSTANTS.LOGIN}
          render={() => (
            <Suspense fallback={<Loader loaderHeight="calc(100vh - 10px)" />}>
              <LoginLazyComponent></LoginLazyComponent>
            </Suspense>
          )}
        ></Route>

        <Route
          exact
          path={ROUTE_CONSTANTS.FORGET_PASSWORD}
          render={() => (
            <Suspense fallback={<Loader loaderHeight="calc(100vh - 10px)" />}>
              <ForgetPasswordLazyComponent></ForgetPasswordLazyComponent>
            </Suspense>
          )}
        ></Route>

        {/* <Route
          exact
          path={ROUTE_CONSTANTS.RESETPASSWORD}
          render={() => (
            <Suspense fallback={<loader />}>
              <ResetPasswordLazyComponent></ResetPasswordLazyComponent>
            </Suspense>
          )}
        ></Route> */}

        <Route
          exact
          path={ROUTE_CONSTANTS.RESET}
          render={() => (
            <Suspense fallback={<Loader loaderHeight="calc(100vh - 10px)" />}>
              <ResetLazyComponent></ResetLazyComponent>
            </Suspense>
          )}
        ></Route>

        <ProtectedRoute
          path={ROUTE_CONSTANTS.LAYOUT}
          component={LayoutLazyComponent}
        />
        <Redirect from="*" to={ROUTE_CONSTANTS.LOGIN} />
      </Switch>
    </BrowserRouter>
  )
}
