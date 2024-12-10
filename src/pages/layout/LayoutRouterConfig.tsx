import React from 'react'
import { Switch, Redirect, BrowserRouter } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { ProtectedRoute } from '../../components/protected-routes/ProtectedRoute'
import { NavigateUserService } from '../../services/navigate-user-service/navigate-user.service'
import AdminWalletInfo from '../aggregator-walletwise-info/AggregatorWalletWiseInfo'
import AggregatorWalletWiseInfo from '../aggregator-walletwise-info/AggregatorWalletWiseInfo'

const CouponHistoryLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/coupon-history/CouponHistory'))
})

const DashboardLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/dashboard/Dashboard'))
})

const MasterLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/master/Master'))
})

const InventoryLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/inventory/Inventory'))
})

const SettingsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/settings/Settings'))
})

const TotalTransactionLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/total-transaction/TotalTransaction'))
})

const AllCouponsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/all-coupons/AllCoupons'))
})

// Aggregator route...

const AggregatorAnalyticsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/aggregator-analytics/AggregatorAnalytics'))
})

const VegaProLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/vega-pro/VegaPro'))
})

const RechargeLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/recharge/Recharge'))
})

const AggregatorReportsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/aggregator-reports/AggregatorReports'))
})

const AggregatorClientInfoLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(
    () => import('../../pages/aggregator-client-info/AggregatorClientInfo')
  )
})

const AggregatorWalletInfoLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(
    () => import('../../pages/aggregator-wallet-info/AggregatorWalletInfo')
  )
})

const AggregatorSettingsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/aggregator-settings/AggregatorSettings'))
})

const AggregatorDashboardLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/aggregator-dashboard/AggregatorDashboard'))
})

const AggregatorSupportLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/aggregator-support/AggregatorSupport'))
})

const AggregatorPlatformPreferenceLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/platform-preference/PlatformPreference'))
})

const AggregatorManageUserLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../aggregator-manage-user/AggregatorManageUser'))
})

// Superadmin Route...

const SuperAdminDashboardLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/super-admin-dashboard/SuperAdminDashboard'))
})

const SuperAdminUsersLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/super-admin-users/SuperAdminUsers'))
})

const SuperAdminClientsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/super-admin-clients/SuperAdminClients'))
})

const SuperAdminInventoryLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/super-admin-inventory/SuperAdminInventory'))
})

const SuperAdminCouponHistoryLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(
    () =>
      import('../../pages/super-admin-coupon-history/SuperAdminCouponHistory')
  )
})

const SuperAdminTransactionLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(
    () => import('../../pages/super-admin-transaction/SuperAdminTransaction')
  )
})

const SuperAdminSettingsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/super-admin-settings/SuperadminSettings'))
})

const SuperAdminManageUserLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(
    () => import('../../pages/super-admin-manage-user/SuperAdminManageUser')
  )
})

const PaymentsLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../../pages/payments/Payments'))
})

const AggregatorWalletWiseInfoLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(
    () => import('../aggregator-walletwise-info/AggregatorWalletWiseInfo')
  )
})

const GenerateInvoiceLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../generate-invoice/GenerateInvoice'))
})

const ManageStoreLazyComponent = React.lazy(() => {
  return new Promise<void>((resolve) => {
    resolve()
  }).then(() => import('../manage-store/ManageStore'))
})

const routes = [
  {
    path: ROUTE_CONSTANTS.DASHBOARD,
    component: DashboardLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.MASTER,
    component: MasterLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.COUPON_HISTORY,
    component: CouponHistoryLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.INVENTORY,
    component: InventoryLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SETTINGS,
    component: SettingsLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.TOTAL_TRANSACTION,
    component: TotalTransactionLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.ALL_COUPONS,
    component: AllCouponsLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_ANALYTICS,
    component: AggregatorAnalyticsLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_CLENT_INFO,
    component: AggregatorClientInfoLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_WALLET_INFO,
    component: AggregatorWalletInfoLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.VEGAPRO,
    component: VegaProLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.RECHARGE,
    component: RechargeLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.RECHARGE,
    component: RechargeLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_DASHBOARD,
    component: AggregatorDashboardLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_REPORTS,
    component: AggregatorReportsLazyComponent,
    exact: true,
    isProtected: true,
  },
  // {
  //   path: ROUTE_CONSTANTS.AGGREGATOR_SETTINGS,
  //   component: AggregatorReportsLazyComponent,
  //   exact: true,
  //   isProtected: true,
  // },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_SUPPORT,
    component: AggregatorSupportLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_PLATFORM_PREFERENCE,
    component: AggregatorPlatformPreferenceLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_MANAGE_USER,
    component: AggregatorManageUserLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_DASHBOARD,
    component: SuperAdminDashboardLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_CLIENTS,
    component: SuperAdminClientsLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_USERS,
    component: SuperAdminUsersLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_INVENTORY,
    component: SuperAdminInventoryLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_COUPON_HISTORY,
    component: SuperAdminCouponHistoryLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_TRANSACTION,
    component: SuperAdminTransactionLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_SETTINGS,
    component: SuperAdminSettingsLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.SUPERADMIN_MANAGE_USER,
    component: SuperAdminManageUserLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.PAYMENT,
    component: PaymentsLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.AGGREGATOR_WALLETWISE_INFO,
    component: AggregatorWalletWiseInfoLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.GENERATE_INVOICE,
    component: GenerateInvoiceLazyComponent,
    exact: true,
    isProtected: true,
  },
  {
    path: ROUTE_CONSTANTS.MANAGE_STORE,
    component: ManageStoreLazyComponent,
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
