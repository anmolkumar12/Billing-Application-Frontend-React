import React, { Suspense, useEffect, useRef } from 'react'
import { Route, useHistory } from 'react-router-dom'
import { CONSTANTS } from '../../constants/Constants'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { NavigateUserService } from '../../services/navigate-user-service/navigate-user.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { TokenService } from '../../services/token-service/token-service'
import { Loader } from '../ui/loader/Loader'
import { AuthService } from '../../services/auth-service/auth.service'

export const ProtectedRoute: React.FC<{
  component: React.FC
  path: string
  exact?: boolean
}> = (props) => {
  const isMountRef = useRef(false)
  const history = useHistory()
  useEffect(() => {
    isMountRef.current = true;
    AuthService.validateToken().then((response)=>{
      if(response.tokenIsValid){
        history.push(new NavigateUserService().getRoute());
      }
      else {
        history.push(ROUTE_CONSTANTS.LOGIN);
        ToasterService.show('Authorization Failure', CONSTANTS.ERROR)
      }
    })
    return () => {
      isMountRef.current = false
    }
  }, [])
  return isMountRef.current ? (
    <Route
      path={props.path}
      exact={props.exact}
      render={() => (
        <Suspense fallback={<Loader loaderHeight="calc(100vh - 70px)" />}>
          <props.component></props.component>
        </Suspense>
      )}
    />
  ) : (
    <Loader />
  )
}
