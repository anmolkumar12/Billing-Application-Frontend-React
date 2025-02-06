import Cookies from 'universal-cookie'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { AuthService } from '../auth-service/auth.service'
const cookies = new Cookies();
export class NavigateUserService {
  getRoute = (): any => {
    const path = window.location.pathname
    const userRole = cookies.get("userRole");    
    if (
      userRole === 'Admin' &&
      (path === ROUTE_CONSTANTS.INVENTORY ||
        path === ROUTE_CONSTANTS.MASTER ||
        path === ROUTE_CONSTANTS.CONTRACT ||
        path === ROUTE_CONSTANTS.COUPON_HISTORY ||
        path === ROUTE_CONSTANTS.TOTAL_TRANSACTION ||
        path === ROUTE_CONSTANTS.SETTINGS ||
        path === ROUTE_CONSTANTS.PAYMENT ||
        path === ROUTE_CONSTANTS.AGGREGATOR_ANALYTICS ||
        path === ROUTE_CONSTANTS.AGGREGATOR_CLENT_INFO ||
        path === ROUTE_CONSTANTS.AGGREGATOR_WALLET_INFO ||
        path === ROUTE_CONSTANTS.GENERATE_INVOICE ||
        path === ROUTE_CONSTANTS.CLIENT ||
        path === ROUTE_CONSTANTS.INVOICE)
    ) {
      return path
    } else {
      return this.getDefaultRoute()
    }
  }

  getDefaultRoute = (): any => {
    const userRole = cookies.get("userRole");
    if (userRole === 'Admin') {
      return ROUTE_CONSTANTS.MASTER
    } else if (userRole === 'Aggregator') {
      return ROUTE_CONSTANTS.AGGREGATOR_DASHBOARD
    } else if (userRole === 'Client') {
      return ROUTE_CONSTANTS.SUPERADMIN_DASHBOARD
    } else if (userRole === 'Invoice') {
      return ROUTE_CONSTANTS.SUPERADMIN_DASHBOARD
    }  else {
      return ROUTE_CONSTANTS.LAYOUT
    }
  }
}
