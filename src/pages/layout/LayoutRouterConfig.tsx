import React from 'react'
import { Switch, Redirect, BrowserRouter } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { ProtectedRoute } from '../../components/protected-routes/ProtectedRoute'
import { NavigateUserService } from '../../services/navigate-user-service/navigate-user.service'

const MasterLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/master/Master'))
})

const ContractLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../po-contract/PoContract'))
})

const ClientLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/client/Client'))
})

const InvoiceLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/invoice/Invoice'))
})

const routes = [
  {
    path: ROUTE_CONSTANTS.MASTER,
    component: MasterLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.CONTRACT,
    component: ContractLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.CLIENT,
    component: ClientLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.INVOICE,
    component: InvoiceLazyComponent,
    exact: true,
    isProtected: true,
  },
]

export const LayoutRouterConfig: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((item: any, index: any) => {
          return item.isProtected ? (
            <ProtectedRoute
              key={index}
              path={item.path}
              component={item.component}
              exact={item.exact}
            />
          ) : null
        })}

        <Redirect
          from={ROUTE_CONSTANTS.LAYOUT}
          to={new NavigateUserService().getDefaultRoute()}
        />

        <Redirect from="*" to={ROUTE_CONSTANTS.MASTER} />
      </Switch>
    </BrowserRouter>
  )
}
