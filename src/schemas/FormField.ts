export interface FormFieldValues {
  inputType:
    | 'inputtext'
    | 'password'
    | 'singleDatePicker'
    | 'contactnumber'
    | 'singleSelect'
    | 'multiSelect'
    | 'inputMask'
    | 'inputSwitch'
    | 'radio'
    | 'inputNumber'
    | 'monthPicker'
    | 'dateRange'
    | 'inputtextarea'
    | 'textArea'
  label: string
  validation?: FormValidation
  matchValidationKey?: string
  valid?: boolean
  touched?: boolean
  errorMessage?: string | null
  value: string | number | boolean | Date | null | string[]
  fieldWidth?: string
  options?: optionsObj[]
  customMask?: string
  maskPlaceholder?: string
  formName?: string
  radioOptions?: RadioOptionsInteface[]
  labelPosition?: string //labelPosition for radio - can be left or top
  inputNumberOptions?: InputNumberParameters
  disable?: boolean
  hideField?: boolean
  rows?: number
  cols?: number
  min?: string
  max?: string
  feedback?: boolean
}

export interface optionsObj {
  label: string
  value: string
}

export interface FormValidation {
  required?: boolean
  minlength?: number
  maxlength?: number
  email?: boolean
  match?: boolean
  maskFixedLength?: number
  maskMinLength?: number
  maskMaxLength?: number
  pattern?: string
  patternHint?: string
}

export interface FormType {
  [key: string]: FormFieldValues
}

export interface RadioOptionsInteface {
  value: string | number
  label: string
  tooltip?: string
}

export interface InputNumberParameters {
  mode?: string //default decimal (can be decimal or currency)
  minFractionDigits?: number
  maxFractionDigits?: number
  min?: number
  max?: number
  currency?: string //can be USD/INR etc.
  currencyDisplay?: string //default symbol. (can be symbol/name)
  locale?: string
  prefix?: string
  suffix?: string
}
export interface updateOptionsObj {
  fieldKey: string
  options: optionsObj[]
}

export interface submitFormData {
  [key: string]: any
}
