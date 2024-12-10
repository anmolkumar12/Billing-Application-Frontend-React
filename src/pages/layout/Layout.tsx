import React, { useState } from 'react'
import Sidenav from '../../components/ui/side-nav/SideNav'
import TopNavbar from '../../components/ui/top-nav/TopNavbar'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { ImageUrl } from '../../utils/ImageUrl'
import { LayoutRouterConfig } from './LayoutRouterConfig'
import './Layout.scss'
import { AuthService } from '../../services/auth-service/auth.service'
import _ from 'lodash'
import { useHistory } from 'react-router-dom'
import BackButton from '../../components/ui/back-button/BackButton'

const Layout: React.FC = () => {
  const menu = [
    {
      name: 'Master',
      moduleName: 'MasterDashboard',
      link: ROUTE_CONSTANTS.MASTER,
      // icon: ImageUrl.DashboardImg,
      // selectedIcon: ImageUrl.DashboardWhiteImg,
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Invoice',
      moduleName: 'InvoiceDashboard',
      link: ROUTE_CONSTANTS.INVOICE,
      // icon: ImageUrl.DashboardImg,
      // selectedIcon: ImageUrl.DashboardWhiteImg,
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Payment',
      moduleName: 'PaymentDashboard',
      link: ROUTE_CONSTANTS.PAYMENT,
      // icon: ImageUrl.DashboardImg,
      // selectedIcon: ImageUrl.DashboardWhiteImg,
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Performa Invoice',
      moduleName: 'PerformaDashboard',
      link: ROUTE_CONSTANTS.PER_INVOICE,
      // icon: ImageUrl.DashboardImg,
      // selectedIcon: ImageUrl.DashboardWhiteImg,
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    // {
    //   name: 'Dashboard',
    //   moduleName: 'VendorDashboard',
    //   link: ROUTE_CONSTANTS.DASHBOARD,
    //   icon: ImageUrl.DashboardImg,
    //   selectedIcon: ImageUrl.DashboardWhiteImg,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Manager', 'Viewer'],
    // },
    // {
    //   name: 'Inventory',
    //   moduleName: 'VendorInventory',
    //   link: ROUTE_CONSTANTS.INVENTORY,
    //   icon: ImageUrl.Inventory,
    //   selectedIcon: ImageUrl.InventoryWhite,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Manager', 'Viewer'],
    // },
    // {
    //   name: 'Reports',
    //   moduleName: 'VendorCouponHistory',
    //   link: ROUTE_CONSTANTS.COUPON_HISTORY,
    //   icon: ImageUrl.CouponHistory,
    //   selectedIcon: ImageUrl.CouponHistoryWhite,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Manager', 'Viewer'],
    // },
    // {
    //   name: 'Settings',
    //   moduleName: 'VendorSettings',
    //   link: ROUTE_CONSTANTS.SETTINGS,
    //   icon: ImageUrl.Configuration,
    //   selectedIcon: ImageUrl.ConfigurationWhite,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Manager', 'Viewer'],
    // },
    // {
    //   name: 'Voucher Payments',
    //   moduleName: 'Voucher Payments',
    //   link: ROUTE_CONSTANTS.PAYMENT,
    //   icon: ImageUrl.VoucherPaymentWhite,
    //   class: 'payment-class',
    //   selectedIcon: ImageUrl.VoucherPayment,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Manager', 'Viewer'],
    // },
    // {
    //   name: 'Aggregator',
    //   moduleName: 'Aggregator',
    //   link: ROUTE_CONSTANTS.AGGREGATOR_ANALYTICS,
    //   icon: ImageUrl.AggregatorDashboardImg,
    //   selectedIcon: ImageUrl.AggregatorDashboardWhiteImg,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Viewer'],
    // },
    // {
    //   name: 'Generate Invoice',
    //   moduleName: 'GenerateInvoice',
    //   link: ROUTE_CONSTANTS.GENERATE_INVOICE,
    //   icon: ImageUrl.generateInvoice,
    //   selectedIcon: ImageUrl.generateInvoiceWhite,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Viewer'],
    // },
    // {
    //   name: 'Manage User',
    //   moduleName: 'SuperAdminManageUser',
    //   link: ROUTE_CONSTANTS.SUPERADMIN_MANAGE_USER,
    //   icon: ImageUrl.ManageUser,
    //   selectedIcon: ImageUrl.ManageUserWhite,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Viewer'],
    // },
    // {
    //   name: 'Manage Store',
    //   moduleName: 'Manage Store',
    //   link: ROUTE_CONSTANTS.MANAGE_STORE,
    //   icon: ImageUrl.ManageStore,
    //   class: 'payment-class',
    //   selectedIcon: ImageUrl.ManageStoreWhite,
    //   systemRole: ['Admin'],
    //   accessRole: ['Admin', 'Manager', 'Viewer'],
    // },
    // {
    //   name: 'Dashboard',
    //   moduleName: 'Dashboard',
    //   link: ROUTE_CONSTANTS.AGGREGATOR_DASHBOARD,
    //   icon: ImageUrl.AggregatorDashboardImg,
    //   selectedIcon: ImageUrl.AggregatorDashboardWhiteImg,
    //   systemRole: ['Aggregator'],
    //   accessRole: ['Admin'],
    // },
    // {
    //   name: 'Platform Preference',
    //   moduleName: 'PlatformPreference',
    //   link: ROUTE_CONSTANTS.AGGREGATOR_PLATFORM_PREFERENCE,
    //   icon: ImageUrl.Configuration,
    //   selectedIcon: ImageUrl.ConfigurationWhite,
    //   systemRole: ['Aggregator'],
    //   accessRole: ['Admin'],
    // },
    // {
    //   name: 'Manage Clients',
    //   moduleName: 'ManageClients',
    //   link: ROUTE_CONSTANTS.AGGREGATOR_MANAGE_USER,
    //   icon: ImageUrl.ManageUser,
    //   selectedIcon: ImageUrl.ManageUserWhite,
    //   systemRole: ['Aggregator'],
    //   accessRole: ['Admin'],
    // },
    // {
    //   name: 'Recharge',
    //   moduleName: 'AggregatorRecharge',
    //   link: ROUTE_CONSTANTS.RECHARGE,
    //   icon: ImageUrl.Recharge,
    //   selectedIcon: ImageUrl.RechargeWhite,
    //   systemRole: ['Aggregator'],
    //   accessRole: ['Admin'],
    // },
    // {
    //   name: 'Reports',
    //   moduleName: 'AggregatorReports',
    //   link: ROUTE_CONSTANTS.AGGREGATOR_REPORTS,
    //   icon: ImageUrl.Reports,
    //   selectedIcon: ImageUrl.ReportsWhite,
    //   systemRole: ['Aggregator'],
    //   accessRole: ['Admin'],
    // },
  ]
  return (
    <>
      <div className="layout-main">
        <div className="side-nav-layout">
          <Sidenav userMenu={menu} />
        </div>
        <div className="rendered-layout">
          <TopNavbar mobileMenu={menu} />

          <div className="scrollable-layout">
            <LayoutRouterConfig />
            <BackButton />
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout
