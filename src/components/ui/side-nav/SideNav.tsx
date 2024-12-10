import React, { useEffect, useState } from 'react'
// import './SideNav.scss'
import classes from './SideNav.module.scss'
import { ROUTE_CONSTANTS } from '../../../constants/RouteConstants'
import { ImageUrl } from '../../../utils/ImageUrl'
import { AuthService } from '../../../services/auth-service/auth.service'
import { TokenService } from '../../../services/token-service/token-service'
import { useHistory } from 'react-router-dom'
import { ToasterService } from '../../../services/toaster-service/toaster-service'
import { CONSTANTS } from '../../../constants/Constants'
import { UtilityService } from '../../../services/utility-service/utility.service'
import { HTTP_RESPONSE } from '../../../enums/http-responses.enum'
import * as _ from 'lodash'
import { access } from 'fs'

const Sidenav: React.FC<{ userMenu: any }> = ({ userMenu }) => {
  const [displayLogoutPanel, setDisplayLogoutPanel] = useState(false)
  const [selectedMenu, setselectedMenu] = useState('MasterDashboard')
  const [isCollapseSideMenu, setIsCollapseSideMenu] = useState(false)
  const menu = userMenu
  const history = useHistory()
  const logOut = () => {
    AuthService.logOut()
      .then((response: any) => {
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          ToasterService.show(response.message, CONSTANTS.SUCCESS)
          localStorage.clear()
          TokenService().clearAllToken()
          AuthService.userInfo.next({})
          history.push(ROUTE_CONSTANTS.LOGIN)
        }
      })
      .catch((err: any) => {
        ToasterService.show(err, CONSTANTS.ERROR)
      })
  }

  useEffect(() => {
    setSelectedMenuItem()
  }, [])

  const setSelectedMenuItem = () => {
    const moduleObj = menu.find(
      (item: any) => item.link == history.location.pathname
    )
    if (moduleObj) {
      setselectedMenu(moduleObj.moduleName)
    } else if (
      history.location.pathname ===
      (ROUTE_CONSTANTS.AGGREGATOR_CLENT_INFO ||
        ROUTE_CONSTANTS.AGGREGATOR_WALLET_INFO)
    ) {
      setselectedMenu('Aggregator')
    } else if (
      history.location.pathname === ROUTE_CONSTANTS.AGGREGATOR_WALLETWISE_INFO
    ) {
      setselectedMenu('Dashboard')
    }
  }

  return (
    <>
      <div
        className={
          isCollapseSideMenu
            ? classes['layout-left-panel'] +
              ' ' +
              classes['layout-left-panel-collapsed']
            : classes['layout-left-panel']
        }
      >
        <div className={classes['left-menubar']}>
          <div className={classes['logo']}>
            <img src="./Polestar Logo.svg" />
          </div>

          <ul>
            {menu.map(
              (
                menuItem: {
                  name: string
                  moduleName: string
                  icon: string
                  selectedIcon: string
                  link: string
                  systemRole: []
                  accessRole: []
                  subTabs: { name: string; link: string }[]
                },
                index: number
              ) => {
                const accessRoleExist = menuItem?.accessRole.filter(
                  (item) => item == AuthService?.currentRole?.value
                )
                if (
                  accessRoleExist.length &&
                  menuItem.systemRole == AuthService?.currentRole?.value
                ) {
                  return (
                    <li key={index}>
                      <a
                        href="#"
                        className={
                          classes[
                            selectedMenu === menuItem.moduleName
                              ? `activeMenu`
                              : ``
                          ]
                        }
                        onClick={() => {
                          setselectedMenu(menuItem.moduleName),
                            history.push(menuItem.link)
                        }}
                      >
                        {!isCollapseSideMenu ? (
                          <>
                            <span>{menuItem.name}</span>
                          </>
                        ) : (
                          <></>
                        )}
                      </a>
                    </li>
                  )
                }
              }
            )}
          </ul>
        </div>

        <div
          className={
            isCollapseSideMenu
              ? classes['logout-btm-menu'] +
                ' ' +
                classes['logout-btm-menu-collapsed']
              : classes['logout-btm-menu']
          }
          onClick={() => setDisplayLogoutPanel(!displayLogoutPanel)}
        >
          <ul onClick={logOut}>
            <li>
              <a>
                <b>
                  <img src={ImageUrl.Logout} />
                </b>
                {!isCollapseSideMenu ? (
                  <>
                    <span>Logout</span>
                  </>
                ) : null}
              </a>
            </li>
          </ul>
        </div>
        {/* collapse side icon */}
        <div
          className={
            isCollapseSideMenu
              ? classes['collapse-icon'] +
                ' ' +
                classes['collapse-icon-collapsed']
              : classes['collapse-icon']
          }
          onClick={() => {
            setIsCollapseSideMenu(!isCollapseSideMenu)
            AuthService.sideNavCollapse.next(!isCollapseSideMenu)
          }}
        >
          {/* {isCollapseSideMenu ? (
            <i className="pi pi-chevron-right"></i>
          ) : (
            <i className="pi pi-chevron-left"></i>
          )} */}
          <i className="pi pi-sort-alt"></i>
        </div>
      </div>
    </>
  )
}

export default Sidenav
