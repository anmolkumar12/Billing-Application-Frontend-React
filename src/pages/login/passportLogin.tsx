import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { CONSTANTS } from '../../constants/Constants'
import { AuthService } from '../../services/auth-service/auth.service'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { NavigateUserService } from '../../services/navigate-user-service/navigate-user.service'
import { TokenService } from '../../services/token-service/token-service'
import { AuthModel } from '../../services/auth-service/auth.model'

const PassportAuth = () => {
  const search = useLocation().search
  const token: any = new URLSearchParams(search).get('token')
  const history = useHistory()

  //   const headers = {}
  if (token) {
    try {
      const tokenParsed = JSON.parse(token)
      TokenService().setToken(
        tokenParsed.accessToken
        // tokenParsed.refresponsehToken
      )
    } catch (err) {
      ToasterService.show('Invalid Response!', 'error')
      history.push(ROUTE_CONSTANTS.LOGIN)
    }
  }

  const getUserDetails = () => {
    AuthService.validateToken()
      .then((response: any) => {
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          const responseData = new AuthModel().modifyValidateTokenData(
            response.data
          )
          AuthService.userInfo.next(responseData)
          AuthService.currentRole.next(responseData?.role[0])
          history.push(new NavigateUserService().getRoute())
        } else {
          history.push(ROUTE_CONSTANTS.LOGIN)
        }
      })
      .catch((error: any) => {
        ToasterService.show('Failed to Login', CONSTANTS.ERROR)
        history.push(ROUTE_CONSTANTS.LOGIN)
      })
  }

  useEffect(() => {
    if (token) {
      getUserDetails()
    } else {
      history.push(ROUTE_CONSTANTS.LOGIN)
    }
  })
  return <div>Loading...</div>
}

export default PassportAuth
