import React from 'react'
import { Dropdown } from 'primereact/dropdown'
import { optionsObj } from '../../../schemas/FormField'
import Label from '../label/Label'
import './SingleSelect.scss'

// interface optionsObj {
//     label: string;
//     value: string;
// }

interface PropsInterface {
  inputtype: 'singleSelect'
  label?: string
  key: string
  value: string | null
  id: string
  changed: any
  blurred: any
  options: optionsObj[]
  formName: string
  disable: boolean
  requiredLabel: boolean
  error?: string | undefined
  touched?: boolean | undefined
  placeholder?: string | undefined
  showClear?: boolean | undefined
}

export const SingleSelectComponent: React.FC<PropsInterface> = (props) => {
  let inputElement = null
  const { value, error, touched, requiredLabel } = props
  const errorMessageStyle: any = {
    fontSize: 10,
    textAlign: 'left',
  }
  const style: any = {
    width: '100%',
    borderRadius: 5,
    fontSize: 12,
    border: '1px solid #ced4da',
  }
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

  switch (props.inputtype) {
    case 'singleSelect':
      inputElement = (
        <Dropdown
          id={props.id + props.formName}
          value={props.value}
          options={props.options}
          onChange={(e) => props.changed(e.value, props.id)}
          onBlur={() => props.blurred(props.id)}
          filter
          disabled={props.disable}
          className="container"
          placeholder={props?.placeholder}
          showClear={props?.showClear}
        />
      )

      break
  }
  return (
    <div className="custom-drwn-sr">
      {props.label && (
        <Label label={props.label} required={props.requiredLabel} />
        // <label htmlFor={props.id + props.formName}>{props.label}</label>
      )}

      <span
        className={
          'p-float-label ' + (props.requiredLabel ? 'required-label' : null)
        }
      >
        {inputElement}
      </span>
      {getErrorMessage() && (
        <div style={getErrorMessageStyle()}>{getErrorMessage()}</div>
      )}
    </div>
  )
}
