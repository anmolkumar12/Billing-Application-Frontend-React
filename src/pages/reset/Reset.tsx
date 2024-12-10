import { useLocation } from 'react-router'
import React, { FormEvent, useState } from 'react'
import { ImageUrl } from '../../utils/ImageUrl'
import './Reset.scss'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { Password } from 'primereact/password'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { AuthService } from '../../services/auth-service/auth.service'
import { TokenService } from '../../services/token-service/token-service'
import { ErrorMessageComponent } from '../../components/error-message/ErrorMessage'
import { CONSTANTS } from '../../constants/Constants'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'

const ResetPassword: React.FC = () => {
  const queryParams = useLocation().search
  const resetPasswordToken = queryParams.substr(3)
  const history = useHistory()
  const [readOnly, setReadOnly] = useState(true)
  const [isResetFormValid, setIsResetFormValid] = useState(true)
  const [showLoader, setShowLoader] = useState(false)
  const [resetFormState, setResetFormState] = useState({
    resetForm: {
      Password: {
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
      confirmPassword: {
        value: '',
        validation: {
          required: true,
          minlength: 1,
          maxlength: 100,
        },
        valid: false,
        touched: false,
        errorMessage: null,
      },
    },
  })

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string
  ) => {
    const updatedForm: any = { ...resetFormState.resetForm }
    updatedForm[fieldKey].value = event.target.value
    updatedForm[fieldKey].touched = true
    setResetFormState({ resetForm: updatedForm })
  }

  const checkFormValidity = () => {
    let valid = true
    Object.entries(resetFormState.resetForm).forEach(([key, value]) => {
      if (!value.valid) {
        valid = valid && false
      }
    })

    if (
      resetFormState?.resetForm?.Password?.value?.length &&
      resetFormState?.resetForm?.Password?.value ===
        resetFormState?.resetForm?.confirmPassword?.value
    ) {
      valid = true
    } else {
      return ToasterService.show(
        "Password and Confirm Password didn't match!",
        CONSTANTS.ERROR
      )
    }
    setIsResetFormValid(valid)
    return valid
  }

  const handleKeyDown = (e: any) => {
    if (e.keyCode == 13) {
      //HERE 13 is keycode for keypress 'Enter'
      e.preventDefault()
      resetPasswordFormHandler()
    }
  }

  const updateValidityHandler = (
    value: boolean,
    fieldKey: string,
    errorMessage: string
  ) => {
    const updatedForm: any = { ...resetFormState.resetForm }
    updatedForm[fieldKey].valid = value
    updatedForm[fieldKey].errorMessage = errorMessage
    setResetFormState({ resetForm: updatedForm })
  }

  const resetPasswordFormHandler = (event?: FormEvent) => {
    event?.preventDefault()
    if (checkFormValidity()) {
      const formData: { [key: string]: any } = {}
      formData.newPassword = resetFormState.resetForm.Password.value
      formData.cpassword = resetFormState.resetForm.confirmPassword.value
      formData.token = resetPasswordToken
      setShowLoader(true)
      AuthService.setNewPassword(formData)
        .then((response: any) => {
          if (
            response &&
            response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS
          ) {
            ToasterService.show(response.message, CONSTANTS.SUCCESS)
            TokenService().clearAllToken()
            history.push(ROUTE_CONSTANTS.LOGIN)
            window.location.reload()
          }
        })
        .catch((error: any) => {
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      ToasterService.show('Please check the fields !', CONSTANTS.ERROR)
    }
  }

  return (
    <>
      <div className="resetPasswordPopup">
        <div className="reset-right-body">
          <h3>Start Your Journey with Vega Coupon Store</h3>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem
            culpa ipsa blanditiis consectetur voluptatibus harum odit quas,
            adipisci eos rerum.
          </p>
          <img src={ImageUrl.LoginImage} alt="" />
        </div>
        <div className="resetPasswordBody">
          <div className="resetPasswordContent">
            <div className="brandLogo">
              <img src={ImageUrl.VegaLogo} alt="" />
            </div>
            <h2>Set New Password</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac
              eleifend lorem, vitae blandit sapiwen.{' '}
            </p>

            <form action="">
              <div className="inputItem">
                <div className="row m-0">
                  <div className="col-12 p-0">
                    <label>New Password</label>
                    <Password
                      id="Password"
                      name="Password"
                      value={resetFormState.resetForm.Password.value}
                      placeholder="Password"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        inputChangedHandler(event, 'Password')
                      }}
                      toggleMask
                      readOnly={readOnly}
                      onFocus={() => setReadOnly(false)}
                      onKeyDown={(e: any) => handleKeyDown(e)}
                    />
                  </div>
                </div>
                {resetFormState.resetForm.Password.touched ||
                !isResetFormValid ? (
                  <ErrorMessageComponent
                    fieldObj={resetFormState.resetForm.Password}
                    fieldKey="Password"
                    updateValidity={updateValidityHandler}
                  />
                ) : null}
              </div>
              <div className="inputItem">
                <div className="row m-0">
                  <div className="col-12 p-0">
                    <label>Confirm New Password</label>
                    <Password
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={resetFormState.resetForm.confirmPassword.value}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        inputChangedHandler(event, 'confirmPassword')
                      }}
                      readOnly={readOnly}
                      onFocus={() => setReadOnly(false)}
                      onKeyDown={(e: any) => handleKeyDown(e)}
                    />
                  </div>
                </div>
                {resetFormState.resetForm.confirmPassword.touched ||
                !isResetFormValid ? (
                  <ErrorMessageComponent
                    fieldObj={resetFormState.resetForm.confirmPassword}
                    fieldKey="confirmPassword"
                    updateValidity={updateValidityHandler}
                  />
                ) : null}
              </div>
              <div className="submitFormItem">
                <button className="btn" onClick={resetPasswordFormHandler}>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
        <img className="dotGridImgTR" src={ImageUrl.LoginDotGrid} alt="" />
        <img className="dotGridImgBL" src={ImageUrl.LoginDotGrid} alt="" />
      </div>
    </>
  )
}

export default ResetPassword
