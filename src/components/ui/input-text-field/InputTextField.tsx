// use this for formik component
// for error and validation its properly aligned with formik
// checkout the props

import React from 'react'
import { InputText } from 'primereact/inputtext'
import Label from '../label/Label'
import './InputTextField.scss'

type InputTextFieldProps = {
  value: string | undefined
  onChange: any
  id?: string
  label?: string
  required?: boolean
  optionalLabel?: string
  placeholder?: string
  name?: string
  error?: string | undefined
  touched?: boolean | undefined
  disabled?: boolean | undefined
  type?: string | undefined
  borderBottom?: boolean | undefined
  display?: string
  onKeyDown?: any
}

const InputTextField = (props: InputTextFieldProps) => {
  const errorMessageStyle: any = {
    fontSize: 10,
    textAlign: 'left',
  }
  const {
    value,
    onChange,
    id,
    label,
    required,
    optionalLabel,
    placeholder,
    error,
    touched,
    disabled,
    display,
    type,
    borderBottom = false,
    onKeyDown,
    name,
  } = props

  const style: any = {
    width: '100%',
    borderRadius: borderBottom ? 0 : 5,
    fontSize: 12,
    border: borderBottom ? '0px solid' : '1px solid #ced4da',
    borderBottom: borderBottom ? `2px solid #ced4da` : '1px solid #ced4da',
    display: display ? display : '',
  }

  // for getting the input styles based on error/touched
  const getStatus = () => {
    // if (error && touched && value === "") return {
    //   ...style,
    //   //border:'1px solid orange',
    //   border: borderBottom ? '0px solid' : '1px solid orange',
    //   borderBottom: borderBottom ? `1px solid orange` : '1px solid orange',
    // }
    // if (touched && error) return {
    //   ...style, border: borderBottom ? '0px solid' : '1px solid red',
    //   borderBottom: borderBottom ? `1px solid red` : '1px solid red',
    // }
    //if(touched) return {...style,border:'1px solid green'}
    return style
  }

  // for getting the styles for message based on error/touched
  const getErrorMessageStyle = () => {
    if (touched && value === '')
      return { ...errorMessageStyle, color: 'orange' }
    if (touched && error) return { ...errorMessageStyle, color: 'red' }
    //if(touched) return {...errorMessageStyle,color:'green'}
    return style
  }

  // for getting the message based on error/touched
  const getErrorMessage = () => {
    if (touched && error) return error
    //if(touched) return 'Success'
    return undefined
  }

  return (
    <div>
      {label && (
        <Label
          label={label}
          required={required}
          optionalLabel={optionalLabel}
        />
      )}
      <InputText
        name={name}
        value={value}
        onChange={onChange}
        id={id}
        style={style}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        onKeyDown={onKeyDown ? onKeyDown : null}
      />
      {getErrorMessage() && (
        <div style={getErrorMessageStyle()}>{getErrorMessage()}</div>
      )}
    </div>
  )
}
export default InputTextField
