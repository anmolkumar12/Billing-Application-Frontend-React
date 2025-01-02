import React from 'react'
import Sidenav from '../../components/ui/side-nav/SideNav'
import TopNavbar from '../../components/ui/top-nav/TopNavbar'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { ImageUrl } from '../../utils/ImageUrl'
import { LayoutRouterConfig } from './LayoutRouterConfig'
import './Layout.scss'
import _ from 'lodash'
import BackButton from '../../components/ui/back-button/BackButton'

const Layout: React.FC = () => {
  const menu = [
    {
      name: 'Master',
      moduleName: 'MasterDashboard',
      link: ROUTE_CONSTANTS.MASTER,
      icon: 'pi pi-book',
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Contract',
      moduleName: 'ContractDashboard',
      link: ROUTE_CONSTANTS.CONTRACT,
      icon: 'pi pi-file-pdf',
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Invoice',
      moduleName: 'InvoiceDashboard',
      link: ROUTE_CONSTANTS.INVOICE,
      icon: 'pi pi-file',
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Shifting',
      moduleName: 'ShiftingDashboard',
      link: ROUTE_CONSTANTS.SHIFTING,
      icon: 'pi pi-file',
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Payment',
      moduleName: 'PaymentDashboard',
      link: ROUTE_CONSTANTS.PAYMENT,
      icon: 'pi pi-credit-card',
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
    {
      name: 'Credit Note',
      moduleName: 'CreditNoteDashboard',
      link: ROUTE_CONSTANTS.CREDIT_NOTE,
      icon: 'pi pi-credit-card',
      systemRole: ['Admin'],
      accessRole: ['Admin', 'Manager', 'Viewer'],
    },
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
