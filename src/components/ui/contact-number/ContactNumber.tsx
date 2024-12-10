import React from 'react'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import Label from '../label/Label'

interface PropsInterface {
  inputtype: 'contactnumber'
  label: string
  key: string
  value: string | null
  id: string
  changed: any
  blurred: any
  customMask?: string
  maskPlaceholder?: string
  formName?: string
  disable: boolean
  requiredLabel: boolean
}

export const ContactNumberComponent: React.FC<PropsInterface> = (props) => {
  let inputElement = null

  inputElement = (
    // <InputMask
    //     mask="(999) 999-9999"
    //     id={props.id + props.formName}
    //     value={props.value || ''}
    //     placeholder="(999) 999-9999"
    //     onChange={(e) => props.changed(e.value, props.id)}
    //     onBlur={() => props.blurred(props.id)}
    //     autoClear={false}
    //     unmask={true}
    //     disabled={props.disable}
    // />
    <PhoneInput
      id={props.id + props.formName}
      value={props.value || ''}
      placeholder="(999) 999-9999"
      onChange={(e) => (e ? props.changed(e, props.id) : null)}
      onBlur={() => props.blurred(props.id)}
      disabled={props.disable}
      countrySelectProps={{ unicodeFlags: true }}
      defaultCountry="IN"
      // onKeyUp={(e: any) => (e ? props.changed(e.target.value, props.id) : null)}
    />
  )

  return (
    <div className="cstm-number-cls">
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
    </div>
  )
}
