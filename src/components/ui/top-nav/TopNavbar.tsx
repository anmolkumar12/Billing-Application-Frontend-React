/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Badge } from 'primereact/badge'
import classes from './TopNavbar.module.scss'
import { ImageUrl } from '../../../utils/ImageUrl'
import { AuthService } from '../../../services/auth-service/auth.service'
import { useHistory } from 'react-router-dom'
import { ToasterService } from '../../../services/toaster-service/toaster-service'
import { TokenService } from '../../../services/token-service/token-service'
import { CONSTANTS } from '../../../constants/Constants'
import ChangePassword from '../../../pages/change-password/ChangePassword'
import { ROUTE_CONSTANTS } from '../../../constants/RouteConstants'
import { HTTP_RESPONSE } from '../../../enums/http-responses.enum'
import { NavigateUserService } from '../../../services/navigate-user-service/navigate-user.service'
import _ from 'lodash'

const TopNavbar: React.FC<{ mobileMenu: any }> = ({ mobileMenu }) => {
  const history = useHistory()

  const [viewProfile, setViewprofile] = useState(false)
  const [viewNotification, setViewNotification] = useState(false)
  const [viewResetPopup, setViewResetPopup] = useState(false)
  const [mobileView, setMobileView] = useState(false)
  const [selectedMenu, setselectedMenu] = useState('')
  const menu = mobileMenu
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

  const getModuleName = () => {
    const path =
      history.location.pathname || new NavigateUserService().getDefaultRoute()
    if (path == ROUTE_CONSTANTS.MASTER) {
      return 'Masters'
    } else {
      return ''
    }
  }

  const logOutAllDevices = () => {
    AuthService.logOutAllDevice()
      .then((response: any) => {
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          ToasterService.show(response.message, CONSTANTS.SUCCESS)
          localStorage.clear()
          TokenService().clearAllToken()
          AuthService.userInfo.next({})
          history.push(ROUTE_CONSTANTS.LOGIN)
        }
      })
      .catch((err) => {
        ToasterService.show(err, CONSTANTS.ERROR)
      })
  }
  return (
    <>
      <div className={classes['top-navbar']}>
        <div className={classes['nav-page-name']}>
          <div
            className={
              classes[
                mobileView
                  ? 'mobile-menubar' + ' ' + 'menubar-open'
                  : 'mobile-menubar'
              ]
            }
            onClick={() => setMobileView(!mobileView)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="pageName">
            <h5>{getModuleName()}</h5>
          </div>
        </div>
        <div className={classes['nav-profile-notification']}>
          {/* <div className="notificationDiv">
            <button
              className={classes['nav-notification'] + ' ' + 'dropdown-toggle'}
              type="button"
              id="notificationDropDown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="pi pi-bell mr-4 p-text-secondary p-overlay-badge">
              </i>
            </button>
            <div
              className={classes['notification-menu'] + ' ' + 'dropdown-menu'}
              aria-labelledby="notificationDropDown"
            >
              <ul className="pullDown">
                <li className={classes['notification-header']}>
                  <h3>
                    Notification
                  </h3>
                </li>
                <li className={classes['notification-body']}>
                  <ul>
                    <div
                      className={
                        classes['no-notification-div'] +
                        ' ' +
                        'perfect-center-column'
                      }
                    >
                      <img src={ImageUrl.ZeroNotification} alt="" />
                      <p>Nothing Here !!!</p>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </div> */}
          <div className={classes['profileDiv']}>
            <button
              className={classes['nav-profile'] + ' ' + 'dropdown-toggle'}
              onClick={() => {
                setViewprofile(!viewProfile)
                setViewNotification(false)
              }}
              type="button"
              id="profileDropDown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={
                  AuthService?.userInfo?.value?.profilePicUrl ||
                  ImageUrl.UserImg
                }
              />
              <h6>{AuthService?.userInfo?.value?.name}</h6>
            </button>
            <div
              className={classes['profile-details'] + ' ' + 'dropdown-menu'}
              aria-labelledby="profileDropDown"
            >
              <ul className="pullDown">
                <li onClick={() => setViewprofile(false)}>
                  {' '}
                  <div
                    className={classes['login-div'] + ' ' + 'perfect-left-row'}
                    onClick={() => setViewResetPopup(true)}
                  >
                    <i className="pi pi-lock"></i>
                    <span>Change Password</span>
                  </div>
                </li>
                <li onClick={() => setViewprofile(false)}>
                  {' '}
                  <div
                    className={classes['login-div'] + ' ' + 'perfect-left-row'}
                    onClick={logOut}
                  >
                    <i className="pi pi-power-off"></i>
                    <span>Log out</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {mobileView ? (
        <>
          <div className={classes['mobile-menu']}>
            <ul>
              {menu.map(
                (
                  menuItem: {
                    name: string
                    moduleName: string
                    icon: string
                    selectedIcon: string
                    link: string
                    systemRole: string
                    accessRole: []
                  },
                  index: number
                ) => {
                  const accessRoleExist = menuItem?.accessRole.filter(
                    (item) => item == AuthService?.currentRole?.value
                  )

                  if (
                    accessRoleExist.length &&
                    menuItem.systemRole ==
                      AuthService?.userInfo?.value?.systemRole
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
                              history.push(menuItem.link),
                              setMobileView(false)
                          }}
                        >
                          <b>
                            {selectedMenu === menuItem.moduleName ? (
                              <img src={menuItem.selectedIcon} />
                            ) : (
                              <img src={menuItem.icon} />
                            )}
                          </b>
                          <span>{menuItem.name}</span>
                        </a>
                      </li>
                    )
                  }
                }
              )}
            </ul>
          </div>
        </>
      ) : null}

      {viewResetPopup ? (
        <>
          <div className={classes['resetPasswordPopup']}>
            <div className="resetPasswordBody">
              <ChangePassword />
              <div
                className="close-popup"
                onClick={() => setViewResetPopup(false)}
              >
                <i className="pi pi-times"></i>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default TopNavbar
