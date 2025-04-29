import React, { useCallback, useEffect, useRef, useState, memo, useMemo } from 'react'
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

const FormComponent: React.FC<{
  form: FormType
  formUpdateEvent: any
  isFormValidFlag: boolean
  updateOptions?: updateOptionsObj[]
  formName?: string
  customClassName?: string
  blurHandler?: any
}> = memo(({ form, formUpdateEvent, isFormValidFlag, updateOptions, formName, customClassName, blurHandler }) => {
  const [state, setState] = useState({ currentForm: form })
  const [isFormValid, setisFormValid] = useState(isFormValidFlag)
  const isMountRef = useRef(false)

  // Memoize form validation logic
  const validateForm = useCallback((clonnedForm: FormType) => {
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
      }
    }
    return clonnedForm
  }, [])

  useEffect(() => {
    if (isMountRef.current) return
    isMountRef.current = true
    
    const validatedForm = validateForm({ ...state.currentForm })
    setState({ currentForm: validatedForm })
    formUpdateEvent(validatedForm)
  }, [])

  useEffect(() => {
    if (!_.isEqual(form, state.currentForm)) {
      setState({ currentForm: form })
      formUpdateEvent(form)
    }
  }, [form])

  useEffect(() => {
    setisFormValid(isFormValidFlag)
  }, [isFormValidFlag])

  useEffect(() => {
    if (updateOptions?.length) {
      const updatedForm = { ...state.currentForm }
      updateOptions.forEach((item) => {
        updatedForm[item.fieldKey].options = item.options
      })
      setState({ currentForm: updatedForm })
      formUpdateEvent(updatedForm)
    }
  }, [updateOptions])

  const debounceFormUpdateEventHandler = useMemo(
    () => _.debounce((updatedForm: FormType) => {
      formUpdateEvent(_.cloneDeep(updatedForm))
    }, 300),
    [formUpdateEvent]
  )

  const inputChangedHandler = useCallback((value: any, id: string) => {
    const updatedForm = _.cloneDeep(form)
    updatedForm[id].value = value
    formUpdateEvent(updatedForm)
  }, [form, formUpdateEvent])

  const handleBlur = useCallback((id: string) => {
    if (blurHandler) {
      blurHandler(id)
    }
  }, [blurHandler])

  const updateValidityHandler = useCallback((
    valid: boolean,
    fieldKey: string,
    errorMessage: string
  ) => {
    const updatedForm = { ...state.currentForm }
    updatedForm[fieldKey].valid = valid
    updatedForm[fieldKey].errorMessage = errorMessage
    setState({ currentForm: updatedForm })
    formUpdateEvent(updatedForm)
  }, [state.currentForm, formUpdateEvent])

  // Memoize form fields to prevent unnecessary re-renders
  const formFields = useMemo(() => {
    return Object.entries(state.currentForm).map(([key, value]) => {
      if (value.hideField) return null

      const commonProps = {
        key: key + '-input',
        id: key,
        label: value.label,
        value: value.value,
        changed: inputChangedHandler,
        blurred: handleBlur,
        formName: formName || 'form1',
        disable: value.disable || false,
        requiredLabel: !!(value.validation && value.validation.required)
      }

      if ((value.inputType === 'inputtext' || value.inputType === 'password') && 
          (typeof value.value === 'string' || value.value === null)) {
        return (
          <div className={value.fieldWidth || 'col-md-3'} key={key + '-div'}>
            <div className="dynamic-common-form">
              <div className="log-input">
                <InputComponent
                  {...commonProps}
                  inputtype={value.inputType}
                  feedback={value.feedback}
                  value={value.value !== null ? String(value.value) : null}
                />
                {(state.currentForm[key].touched || !isFormValid) && (
                  <ErrorMessageComponent
                    fieldObj={state.currentForm[key]}
                    fieldKey={key}
                    updateValidity={updateValidityHandler}
                    key={key + '-error'}
                  />
                )}
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
                  blurred={handleBlur}
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
                  blurred={handleBlur}
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
                  blurred={handleBlur}
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
                  blurred={handleBlur}
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
                  blurred={handleBlur}
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
                  blurred={handleBlur}
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
                  blurred={handleBlur}
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
          <div className={`${value.fieldWidth || 'col-md-3'} inputSwitchAlign`}
          key={key + 'div'}>
            <div className="dynamic-common-form">
              <div className="log-input">
                <InputSwitchComponent
                  inputtype={value.inputType}
                  label={value.label}
                  key={key + 'input'}
                  value={value.value}
                  id={key}
                  changed={inputChangedHandler}
                  blurred={handleBlur}
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
                  blurred={handleBlur}
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
    })
  }, [state.currentForm, isFormValid, inputChangedHandler, handleBlur, updateValidityHandler])

  return (
    <form>
      <div className={customClassName + ' ' + 'row'}>
        {formFields}
      </div>
    </form>
  )
})

FormComponent.displayName = 'FormComponent'

export default FormComponent
