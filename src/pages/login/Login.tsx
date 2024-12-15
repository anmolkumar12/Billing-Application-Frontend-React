import React, { FormEvent, useState } from 'react'
import './Login.scss'
import { ImageUrl } from '../../utils/ImageUrl'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Checkbox } from 'primereact/checkbox'
import { ErrorMessageComponent } from '../../components/error-message/ErrorMessage'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { AuthService } from '../../services/auth-service/auth.service'
import { TokenService } from '../../services/token-service/token-service'
import Cookies from 'universal-cookie'
import { CONSTANTS } from '../../constants/Constants'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'

const Login: React.FC = () => {
  const history = useHistory()

  const [isFormValid, setIsFormValid] = useState(true)

  const [showLoader, setShowLoader] = useState(false)

  const [loginFormState, setLoginFormState] = useState({
    loginForm: {
      email: {
        value: '',
        validation: {
          email: true,
          required: true,
          minlength: 2,
          maxlength: 100,
        },
        valid: false,
        touched: false,
        errorMessage: null,
      },
      password: {
        value: '',
        validation: {
          required: true,
          minlength: 2,
          maxlength: 100,
        },
        valid: false,
        touched: false,
        errorMessage: null,
      },
      isRemember: {
        value: false,
        valid: true,
        touched: true,
        errorMessage: null,
      },
    },
  })

  const [readOnly, setReadOnly] = useState(true)

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string
  ) => {
    const updatedForm: any = { ...loginFormState.loginForm }
    updatedForm[fieldKey].value = event.target.value
    updatedForm[fieldKey].touched = true
    setLoginFormState({ loginForm: updatedForm })
  }

  const handleKeyDown = (e: any) => {
    if (e.keyCode == 13) {
      e.preventDefault()
      signInSubmitHandler()
    }
  }

  const storeCookie = () => {
    if (loginFormState.loginForm.isRemember) {
      const cookies = new Cookies()
      const dateNow = new Date()
      dateNow.setDate(dateNow.getDate() + 7)
      cookies.set('email', loginFormState.loginForm.email, { expires: dateNow })
      cookies.set('password', loginFormState.loginForm.password, {
        expires: dateNow,
      })
      cookies.set('isRemember', loginFormState.loginForm.isRemember, {
        expires: dateNow,
      })
    }
  }

  const signInSubmitHandler = (event?: FormEvent) => {
    if (event) event.preventDefault()
    if (checkFormValidity()) {
      const formData: { [key: string]: any } = {}
      formData.identifier = loginFormState.loginForm.email.value
      formData.password = loginFormState.loginForm.password.value
      // setShowLoader(true)
      AuthService.login(formData)
        .then((response: any) => {
          console.log('response', response)
          // setShowLoader(false)
          if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
            // const responseData = new AuthModel().modifyUserInfo(response.data)
            // console.log('responseData', responseData)
            TokenService().setToken(
              response?.data?.token
              // responseData?.tokens?.refreshToken
            )
            storeCookie()
            AuthService.userInfo.next({
              name: response?.data?.name,
              userId: response?.data?.userid,
              email: formData.identifier
            })
            AuthService.currentRole.next(response?.data?.role)
          }
          ToasterService.show('Logged In Successfully.', CONSTANTS.SUCCESS)
          history.push(ROUTE_CONSTANTS.LAYOUT)
          console.log('login page only')
          // }
        })
        .catch((error: any) => {
          setShowLoader(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      ToasterService.show('Please Check the Fields!', CONSTANTS.ERROR)
    }
  }

  const checkFormValidity = () => {
    let valid = true
    Object.entries(loginFormState.loginForm).forEach(([key, value]) => {
      if (!value.valid) {
        valid = valid && false
      }
    })
    setIsFormValid(valid)
    return valid
  }

  const updateValidityHandler = (
    value: boolean,
    fieldKey: string,
    errorMessage: string
  ) => {
    const updatedForm: any = { ...loginFormState.loginForm }
    updatedForm[fieldKey].valid = value
    updatedForm[fieldKey].errorMessage = errorMessage
    setLoginFormState({ loginForm: updatedForm })
  }

  const setCheckboxHandler = (event: boolean, fieldKey: string) => {
    const updatedForm: any = { ...loginFormState.loginForm }
    updatedForm[fieldKey].value = event
    setLoginFormState({ loginForm: updatedForm })
  }

  const google = () => {
    window.open(
      `${process.env.REACT_APP_API_BASEURL}/v1/passport/auth/google`,
      '_self'
    )
  }

  return (
    <div className="loginMainBody">
      <div className="login-right-body">
        <h3>Effortless Billing Solutions for Your Business</h3>
        <p>
        Effortlessly manage and track your billing processes with real-time updates, ensuring accuracy and efficiency for both short-term and long-term financial goals
        </p>
        <img src={ImageUrl.LoginImage} alt="" />
      </div>
      <div className="login-body">
        <div className="loginContent">
          <div className="brandLogo">
          <img src="./Polestar Logo.svg" />
          </div>
          <h2>Login</h2>
          <p>
          Log in to access exclusive billing features, manage transactions, track payments, and more. Install the Billing App for a seamless and enhanced experience.
          </p>

          <form action="">
            <div className="inputItem">
              <div className="row m-0">
                <div className="col-12 p-0">
                  <label>Username</label>
                  {/* <input type="text" placeholder="Username" /> */}
                  <InputText
                    id="email"
                    name="email"
                    placeholder="Username"
                    value={loginFormState.loginForm.email.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      inputChangedHandler(e, 'email')
                    }
                    readOnly={readOnly}
                    onFocus={() => setReadOnly(false)}
                  />
                </div>
              </div>
              {loginFormState.loginForm.email.touched || !isFormValid ? (
                <ErrorMessageComponent
                  fieldObj={loginFormState.loginForm.email}
                  fieldKey="email"
                  updateValidity={updateValidityHandler}
                />
              ) : null}
            </div>
            <div className="inputItem">
              <div className="row m-0">
                <div className="col-12 p-0">
                  <label>Password</label>
                  <Password
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={loginFormState.loginForm.password.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      inputChangedHandler(e, 'password')
                    }
                    feedback={false}
                    onKeyDown={(e: any) => handleKeyDown(e)}
                    toggleMask
                    readOnly={readOnly}
                    onFocus={() => setReadOnly(false)}
                  />
                </div>
              </div>
              {loginFormState.loginForm.password.touched || !isFormValid ? (
                <ErrorMessageComponent
                  fieldKey="password"
                  fieldObj={loginFormState.loginForm.password}
                  updateValidity={updateValidityHandler}
                />
              ) : null}
            </div>
            <div className="inputCheckboxItem">
              <div className="row m-0">
                <div className="col-6 p-0 d-flex align-items-center p-0">
                  {/* <input type="checkbox" name="" id="" /> */}
                  <Checkbox
                    id="isRemember"
                    onChange={(e: any) =>
                      setCheckboxHandler(e.checked, 'isRemember')
                    }
                    checked={loginFormState.loginForm.isRemember.value}
                  ></Checkbox>
                  <label>Remember Me</label>
                </div>
                {/* <div className="col-6 d-flex justify-content-end align-items-center p-0">
                  <NavLink to={ROUTE_CONSTANTS.FORGET_PASSWORD} exact>
                    <h6>Forgot Password?</h6>
                  </NavLink>
                </div> */}
              </div>
            </div>
            <div className="submitFormItem">
              <button className="btn" onClick={signInSubmitHandler}>
                LOGIN
              </button>
            </div>
          </form>
          {/* <div className="sign-up-section">
            <h6>Or Login With</h6>
            <ul>
              <li onClick={google}>
                <div className="sign-up-mail">
                  <div className="mail-img">
                    <img src={ImageUrl.GoogleIconColored} alt="" />
                  </div>
                  <div className="mail-text">
                    <span>Login with Gmail</span>
                  </div>
                </div>
              </li>
            </ul>
          </div> */}
        </div>
        {/* <img className="loginImg" src={ImageUrl.loginImage} alt="" /> */}
      </div>
      <img className="dotGridImgTR" src={ImageUrl.LoginDotGrid} alt="" />
      <img className="dotGridImgBL" src={ImageUrl.LoginDotGrid} alt="" />
    </div>
  )
}

export default Login
