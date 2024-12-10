import React, { FormEvent, useState } from 'react'
import './ForgetPassword.scss'
import { ImageUrl } from '../../utils/ImageUrl'
import { NavLink, useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { InputText } from 'primereact/inputtext'
import { ErrorMessageComponent } from '../../components/error-message/ErrorMessage'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { AuthService } from '../../services/auth-service/auth.service'
import { CONSTANTS } from '../../constants/Constants'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'

const ForgetPassword: React.FC = () => {
  const history = useHistory()
  const [forgetPasswordState, setForgetPasswordState] = useState({
    forgetPasswordForm: {
      email: {
        value: '',
        validation: {
          require: true,
          email: true,
          minlength: 2,
          maxlength: 100,
        },
        valid: true,
        touched: false,
        errorMessage: null,
      },
    },
  })

  const [isFormValid, setIsFormValid] = useState(true)
  const [showLoader, setShowLoader] = useState(false)

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string
  ) => {
    const updatedForm: any = { ...forgetPasswordState.forgetPasswordForm }
    updatedForm[fieldKey].value = event.target.value
    setForgetPasswordState({ forgetPasswordForm: updatedForm })
  }

  const blurHandler = (fieldKey: string) => {
    const updatedForm: any = { ...forgetPasswordState.forgetPasswordForm }
    updatedForm[fieldKey].touched = true
    setForgetPasswordState({ forgetPasswordForm: updatedForm })
  }

  const updateValidityHandler = (
    value: boolean,
    fieldKey: string,
    errorMessage: string
  ) => {
    const updatedForm: any = { ...forgetPasswordState.forgetPasswordForm }
    updatedForm[fieldKey].valid = value
    updatedForm[fieldKey].errorMessage = errorMessage
    setForgetPasswordState({ forgetPasswordForm: updatedForm })
  }

  const checkFormValidity = () => {
    let valid = true
    Object.entries(forgetPasswordState.forgetPasswordForm).forEach(
      ([key, value]) => {
        if (!value.valid || !value.touched) {
          valid = false
        }
      }
    )
    setIsFormValid(valid)
    return valid
  }

  const forgetPasswordHandler = (event: FormEvent) => {
    event?.preventDefault()
    if (checkFormValidity()) {
      const formData: { [key: string]: any } = {}
      formData.email = forgetPasswordState.forgetPasswordForm.email.value
      setShowLoader(true)
      AuthService.forgetPassword(formData).then((response: any) => {
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          ToasterService.show(
            'Forget Pasword Link has been sent to your Email Address.',
            CONSTANTS.SUCCESS
          )
          history.push(ROUTE_CONSTANTS.LOGIN)
          window.location.reload()
        }
      })
    } else {
      ToasterService.show('Please check your Email Address!', CONSTANTS.ERROR)
    }
  }

  return (
    <div className="forgetPasswordMainBody">
      <div className="forgetPassword-right-body">
        <h3>Start Your Journey with Vega Coupon Store</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem
          culpa ipsa blanditiis consectetur voluptatibus harum odit quas,
          adipisci eos rerum.
        </p>
        <img src={ImageUrl.LoginImage} alt="" />
      </div>
      <div className="forgetPasswordBody">
        <div className="forgetPasswordContent">
          <div className="brandLogo">
            <img src={ImageUrl.VegaLogo} alt="" />
          </div>
          <h2>Forgot Password</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac
            eleifend lorem, vitae blandit sapiwen.{' '}
          </p>

          <form action="">
            <div className="inputItem">
              <div className="row m-0">
                <div className="col-12 p-0">
                  <label>Email Address</label>
                  {/* <input type="text" placeholder="Email Address" /> */}
                  <InputText
                    id="email"
                    placeholder="Email Address"
                    value={forgetPasswordState.forgetPasswordForm.email.value}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      inputChangedHandler(event, 'email')
                    }}
                    onBlur={() => blurHandler('email')}
                  />
                  {forgetPasswordState.forgetPasswordForm.email.touched ||
                  !isFormValid ? (
                    <ErrorMessageComponent
                      fieldObj={forgetPasswordState.forgetPasswordForm.email}
                      fieldKey="email"
                      updateValidity={updateValidityHandler}
                    ></ErrorMessageComponent>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="returnToSignIn">
              <NavLink to={ROUTE_CONSTANTS.LOGIN} exact>
                <h6>
                  Return to <span>Sign In</span>
                </h6>
              </NavLink>
            </div>
            <div className="submitFormItem">
              <button className="btn" onClick={forgetPasswordHandler}>
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
      <img className="dotGridImgTR" src={ImageUrl.LoginDotGrid} alt="" />
      <img className="dotGridImgBL" src={ImageUrl.LoginDotGrid} alt="" />
    </div>
  )
}

export default ForgetPassword
