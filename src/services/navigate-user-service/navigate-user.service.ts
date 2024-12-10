import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { AuthService } from '../auth-service/auth.service'
export class NavigateUserService {
  getRoute = (): any => {
    const path = window.location.pathname
    if (
      AuthService?.currentRole?.value === 'Admin' &&
      (path === ROUTE_CONSTANTS.INVENTORY ||
        path === ROUTE_CONSTANTS.MASTER ||
        path === ROUTE_CONSTANTS.COUPON_HISTORY ||
        path === ROUTE_CONSTANTS.TOTAL_TRANSACTION ||
        path === ROUTE_CONSTANTS.SETTINGS ||
        path === ROUTE_CONSTANTS.PAYMENT ||
        path === ROUTE_CONSTANTS.AGGREGATOR_ANALYTICS ||
        path === ROUTE_CONSTANTS.AGGREGATOR_CLENT_INFO ||
        path === ROUTE_CONSTANTS.AGGREGATOR_WALLET_INFO ||
        path === ROUTE_CONSTANTS.GENERATE_INVOICE)
    ) {
      return path
    } else {
      return this.getDefaultRoute()
    }
  }

  getDefaultRoute = (): any => {
    if (AuthService?.currentRole?.value === 'Admin') {
      return ROUTE_CONSTANTS.MASTER
    } else if (AuthService?.currentRole?.value === 'Aggregator') {
      return ROUTE_CONSTANTS.AGGREGATOR_DASHBOARD
    } else if (AuthService?.currentRole?.value === 'Client') {
      return ROUTE_CONSTANTS.SUPERADMIN_DASHBOARD
    }
  }
}
