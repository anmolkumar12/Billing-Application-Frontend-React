import React, { FormEvent, useState } from 'react'
import { ImageUrl } from '../../utils/ImageUrl'
import './ChangePassword.scss'
import { useHistory } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '../../constants/RouteConstants'
import { Password } from 'primereact/password'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { AuthService } from '../../services/auth-service/auth.service'
import { TokenService } from '../../services/token-service/token-service'
import { ErrorMessageComponent } from '../../components/error-message/ErrorMessage'
import { CONSTANTS } from '../../constants/Constants'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'

const ChangePassword: React.FC = () => {
  const history = useHistory()
  const [readOnly, setReadOnly] = useState(true)
  const [isResetFormValid, setIsResetFormValid] = useState(true)
  const [showLoader, setShowLoader] = useState(false)
  const [resetFormState, setResetFormState] = useState({
    resetForm: {
      oldPassword: {
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
      newPassword: {
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
      confirmNewPassword: {
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
      resetFormState?.resetForm?.newPassword?.value?.length &&
      resetFormState?.resetForm?.newPassword?.value ===
        resetFormState?.resetForm?.confirmNewPassword?.value
    ) {
      valid = true
    } else {
      return ToasterService.show(
        "New and Confirm Password didn't match!",
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
      formData.email = AuthService?.userInfo?.value?.email
      formData.newPassword = resetFormState.resetForm.newPassword.value
      formData.currentPassword = resetFormState.resetForm.oldPassword.value
      setShowLoader(true)
      AuthService.changePassword(formData)
        .then((response: any) => {
          if (
            response &&
            response?.statusCode === HTTP_RESPONSE.REQUEST_SUCCESS
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
    <div className="resetPasswordContent">
      <div className="brandLogo">
      <img src="./Polestar Logo.svg" />
      </div>
      <h2>Change Password</h2>
      <form action="">
        <div className="inputItem">
          <div className="row m-0">
            <div className="col-12 p-0">
              <label>Old Password</label>
              <Password
                id="oldPassword"
                name="oldPassword"
                value={resetFormState.resetForm.oldPassword.value}
                placeholder="Old Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  inputChangedHandler(event, 'oldPassword')
                }}
                toggleMask
                readOnly={readOnly}
                onFocus={() => setReadOnly(false)}
                onKeyDown={(e: any) => handleKeyDown(e)}
              />
            </div>
          </div>
          {resetFormState.resetForm.oldPassword.touched || !isResetFormValid ? (
            <ErrorMessageComponent
              fieldObj={resetFormState.resetForm.oldPassword}
              fieldKey="oldPassword"
              updateValidity={updateValidityHandler}
            />
          ) : null}
        </div>
        <div className="inputItem">
          <div className="row m-0">
            <div className="col-12 p-0">
              <label>New Password</label>
              <Password
                id="newPassword"
                name="newPassword"
                value={resetFormState.resetForm.newPassword.value}
                placeholder="New Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  inputChangedHandler(event, 'newPassword')
                }}
                toggleMask
                readOnly={readOnly}
                onFocus={() => setReadOnly(false)}
                onKeyDown={(e: any) => handleKeyDown(e)}
              />
            </div>
          </div>
          {resetFormState.resetForm.newPassword.touched || !isResetFormValid ? (
            <ErrorMessageComponent
              fieldObj={resetFormState.resetForm.newPassword}
              fieldKey="newPassword"
              updateValidity={updateValidityHandler}
            />
          ) : null}
        </div>
        <div className="inputItem">
          <div className="row m-0">
            <div className="col-12 p-0">
              <label>Confirm New Password</label>
              <Password
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={resetFormState.resetForm.confirmNewPassword.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  inputChangedHandler(event, 'confirmNewPassword')
                }}
                readOnly={readOnly}
                onFocus={() => setReadOnly(false)}
                onKeyDown={(e: any) => handleKeyDown(e)}
              />
            </div>
          </div>
          {resetFormState.resetForm.confirmNewPassword.touched ||
          !isResetFormValid ? (
            <ErrorMessageComponent
              fieldObj={resetFormState.resetForm.confirmNewPassword}
              fieldKey="confirmNewPassword"
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
  )
}

export default ChangePassword
