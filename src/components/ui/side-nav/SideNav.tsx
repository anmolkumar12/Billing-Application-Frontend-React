/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-sequences */
import React, { useEffect, useState } from "react";
import classes from "./SideNav.module.scss";
import { ROUTE_CONSTANTS } from "../../../constants/RouteConstants";
import { ImageUrl } from "../../../utils/ImageUrl";
import { AuthService } from "../../../services/auth-service/auth.service";
import { TokenService } from "../../../services/token-service/token-service";
import { useHistory } from "react-router-dom";
import { ToasterService } from "../../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../../constants/Constants";
import { UtilityService } from "../../../services/utility-service/utility.service";
import { HTTP_RESPONSE } from "../../../enums/http-responses.enum";
import * as _ from "lodash";
import { access } from "fs";
import Cookies from "universal-cookie";

const Sidenav: React.FC<{ userMenu: any }> = ({ userMenu }) => {
  const [displayLogoutPanel, setDisplayLogoutPanel] = useState(false);
  const [selectedMenu, setselectedMenu] = useState("MasterDashboard");
  const [isCollapseSideMenu, setIsCollapseSideMenu] = useState(false);
  const menu = userMenu;
  const history = useHistory();
  const cookies = new Cookies();
  const userRole = cookies.get("userRole");
  const logOut = () => {
    AuthService.logOut()
      .then((response: any) => {
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          ToasterService.show(response.message, CONSTANTS.SUCCESS);
          localStorage.clear();
          TokenService().clearAllToken();
          AuthService.userInfo.next({});
          history.push(ROUTE_CONSTANTS.LOGIN);
        }
      })
      .catch((err: any) => {
        ToasterService.show(err, CONSTANTS.ERROR);
      });
  };

  useEffect(() => {
    setSelectedMenuItem();
  }, []);

  const setSelectedMenuItem = () => {
    const moduleObj = menu.find(
      (item: any) => item.link == history.location.pathname
    );
    if (moduleObj) {
      setselectedMenu(moduleObj.moduleName);
    } else if (
      history.location.pathname ===
      (ROUTE_CONSTANTS.AGGREGATOR_CLENT_INFO ||
        ROUTE_CONSTANTS.AGGREGATOR_WALLET_INFO)
    ) {
      setselectedMenu("Aggregator");
    } else if (
      history.location.pathname === ROUTE_CONSTANTS.AGGREGATOR_WALLETWISE_INFO
    ) {
      setselectedMenu("Dashboard");
    }
  };

  return (
    <>
      <div
        className={
          isCollapseSideMenu
            ? classes["layout-left-panel"] +
              " " +
              classes["layout-left-panel-collapsed"]
            : classes["layout-left-panel"]
        }
      >
        <div className={classes["left-menubar"]}>
          <div className={classes["logo"]}>
            <img src="./Polestar Logo.svg" />
          </div>

          <ul>
            {menu.map(
              (
                menuItem: {
                  name: string;
                  moduleName: string;
                  icon: string;
                  selectedIcon: string;
                  link: string;
                  systemRole: [];
                  accessRole: [];
                  subTabs: { name: string; link: string }[];
                },
                index: number
              ) => {
                const accessRoleExist = menuItem?.accessRole.filter(
                  (item) => item == userRole
                );
                if (
                  accessRoleExist.length &&
                  menuItem.systemRole == userRole
                ) {
                  return (
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          setselectedMenu(menuItem.moduleName),
                            history.push(menuItem.link);
                        }}
                      >
                        <b style={{ display: 'flex', alignItems: 'center' }}>
                          <span
                            className={menuItem.icon}
                            style={{ marginRight: '8px' }}
                          ></span>
                          {!isCollapseSideMenu ? (
                            <>
                            {menuItem.name === 'Credit Note' ?<span>{'Credit\u00A0Note'}</span> : <span>{menuItem.name}</span>}
                          </>
                          ) : (
                            <></>
                          )}
                        </b>
                      </a>
                    </li>
                  );
                }
              }
            )}
          </ul>
        </div>

        {/* collapse side icon */}
        <div
          className={
            isCollapseSideMenu
              ? classes["collapse-icon"] +
                " " +
                classes["collapse-icon-collapsed"]
              : classes["collapse-icon"]
          }
          onClick={() => {
            setIsCollapseSideMenu(!isCollapseSideMenu);
            AuthService.sideNavCollapse.next(!isCollapseSideMenu);
          }}
        >
          <i className="pi pi-sort-alt"></i>
        </div>
      </div>
    </>
  );
};

export default Sidenav;
