import React, { useEffect, useRef, useState } from 'react'
import * as _ from 'lodash'
import './Form.scss'
// import classes from './Form.module.scss'
import {
  FormType,
  FormFieldValues,
  updateOptionsObj,
} from '../../../schemas/FormField'
import { ErrorMessageComponent } from '../../error-message/ErrorMessage'
import { CalendarComponent } from '../calendar/Calendar'
import { InputComponent } from '../input/Input'
import { InputMaskComponent } from '../input-mask/InputMask'
import { InputNumberComponent } from '../input-number/InputNumber'
import { InputSwitchComponent } from '../input-switch/InputSwitch'
import { MultiSelectComponent } from '../multi-select/MultiSelect'
import { RadioButtonComponent } from '../radio-button/RadioButton'
import { SingleSelectComponent } from '../single-select/SingleSelect'
import { ContactNumberComponent } from '../contact-number/ContactNumber'
import { TextEditor } from '../text-editor/TextEditor'

export const FormComponent: React.FC<{
  form: FormType
  formUpdateEvent: any
  isFormValidFlag: boolean
  updateOptions?: updateOptionsObj[]
  formName?: string
  customClassName?: string
  blurHandler?: any
}> = (props) => {
  const {
    form,
    formUpdateEvent,
    isFormValidFlag,
    updateOptions,
    formName,
    customClassName,
  } = props
  const [state, setState] = useState({ currentForm: form })
  const [isFormValid, setisFormValid] = useState(isFormValidFlag)
  const isMountRef = useRef(false)
  const isMountRef2 = useRef(false)
  const isMountRef3 = useRef(false)

  useEffect(() => {
    isMountRef.current = true
    if (isMountRef.current) {
      const clonnedForm: FormType = { ...state.currentForm }
      for (const key in clonnedForm) {
        if (
          clonnedForm[key] &&
          clonnedForm[key].validation &&
          clonnedForm[key].validation?.required &&
          !clonnedForm[key].value
        ) {
          clonnedForm[key].valid = false
        } else {
          clonnedForm[key].errorMessage = null
          clonnedForm[key].valid = true

          // updateValidityHandler(true, key, '');
        }
      }

      setState({ currentForm: clonnedForm })
      formUpdateEvent(state.currentForm)
    }
    return () => {
      isMountRef.current = false
    }
  }, [])
  useEffect(() => {
    isMountRef2.current = true

    isMountRef2.current && setState({ currentForm: form })
    return () => {
      isMountRef2.current = false
    }
  }, [form])

  useEffect(() => {
    isMountRef3.current = true

    isMountRef3.current && setisFormValid(isFormValidFlag)
    return () => {
      isMountRef3.current = false
    }
  }, [isFormValidFlag])

  useEffect(() => {
    if (updateOptions && updateOptions.length) {
      //  updateOptions.fieldKey && updateOptions.options)
      const updatedForm: FormType = { ...state.currentForm }
      updateOptions.forEach((item) => {
        updatedForm[item.fieldKey].options = item.options
      })
      setState({ currentForm: updatedForm })
      formUpdateEvent(updatedForm)
    }
  }, [updateOptions])

  const inputChangedHandler = (newValue: any, fieldKey: string) => {
    const updatedForm: FormType = { ...state.currentForm }
    updatedForm[fieldKey].value = newValue
    // updatedForm[fieldKey].touched = true;
    setState({ currentForm: updatedForm })
    formUpdateEvent(state.currentForm)
  }

  // default handle blur
  const handleBlur = (fieldKey: string) => {
    const updatedForm: FormType = { ...state.currentForm }
    updatedForm[fieldKey].touched = true
    setState({ currentForm: updatedForm })
    formUpdateEvent(state.currentForm)
  }

  const { blurHandler = handleBlur } = props

  const updateValidityHandler = (
    valid: boolean,
    fieldKey: string,
    errorMessage: string
  ) => {
    const updatedForm: FormType = { ...state.currentForm }
    updatedForm[fieldKey].valid = valid
    updatedForm[fieldKey].errorMessage = errorMessage
    setState({ currentForm: updatedForm })
    formUpdateEvent(state.currentForm)
  }

  return (
    <form>
      <div className={customClassName + ' ' + 'row'}>
        {Object.entries(state.currentForm).map(([key, value]) => {
          if (
            (value.inputType === 'inputtext' ||
              value.inputType === 'password') &&
            (typeof value.value === 'string' || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <InputComponent
                      inputtype={value.inputType}
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      feedback={value.feedback}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType === 'password' &&
            (typeof value.value === 'string' || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <InputComponent
                      inputtype="inputtext"
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType === 'inputtextarea' &&
            (typeof value.value === 'string' || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <InputComponent
                      inputtype="inputtextarea"
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                      rows={value.rows}
                      cols={value.cols}
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            (value.inputType === 'singleDatePicker' ||
              value.inputType === 'monthPicker' ||
              value.inputType === 'dateRange') &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <CalendarComponent
                      inputtype={value.inputType}
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                      min={value.min}
                      max={value.max}
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType === 'inputMask' &&
            (typeof value.value === 'string' || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <InputMaskComponent
                      inputtype={value.inputType}
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      customMask={value.customMask}
                      maskPlaceholder={
                        value.maskPlaceholder || value.customMask
                      }
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType === 'contactnumber' &&
            (typeof value.value === 'string' || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <ContactNumberComponent
                      inputtype={value.inputType}
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType === 'singleSelect' &&
            (typeof value.value === 'string' || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <SingleSelectComponent
                      inputtype="singleSelect"
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      options={value.options || []}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType === 'multiSelect' &&
            (Array.isArray(value.value) || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <MultiSelectComponent
                      inputtype="multiSelect"
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      options={value.options || []}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType === 'inputSwitch' &&
            (typeof value.value === 'boolean' || value.value === null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <InputSwitchComponent
                      inputtype={value.inputType}
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      blurred={blurHandler}
                      formName={formName || 'form1'}
                      disable={value.disable || false}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType == 'radio' &&
            (typeof value.value == 'string' ||
              typeof value.value == 'number' ||
              value.value == null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <RadioButtonComponent
                      inputtype="radio"
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      radioOptions={value.radioOptions || []}
                      formName={formName || 'form1'}
                      labelPosition={value.labelPosition || 'left'}
                    />
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType == 'inputNumber' &&
            (typeof value.value == 'number' || value.value == null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <InputNumberComponent
                      inputtype="inputNumber"
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      changed={inputChangedHandler}
                      formName={formName || 'form1'}
                      inputNumberOptions={value.inputNumberOptions || {}}
                      disable={value.disable || false}
                      blurred={blurHandler}
                      requiredLabel={
                        !!(value.validation && value.validation.required)
                      }
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else if (
            value.inputType == 'textArea' &&
            (typeof value.value == 'number' || value.value == null) &&
            !value.hideField
          ) {
            return (
              <div className={value.fieldWidth || 'col-md-3'} key={key + 'div'}>
                <div className="dynamic-common-form">
                  <div className="log-input">
                    <TextEditor
                      inputtype="textArea"
                      label={value.label}
                      key={key + 'input'}
                      value={value.value}
                      id={key}
                      onContentStateChange={inputChangedHandler}
                    />
                    {state.currentForm[key].touched || !isFormValid ? (
                      <ErrorMessageComponent
                        fieldObj={state.currentForm[key]}
                        fieldKey={key}
                        updateValidity={updateValidityHandler}
                        key={key + 'error'}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          } else {
            return null
          }
        })}
      </div>
    </form>
  )
}
