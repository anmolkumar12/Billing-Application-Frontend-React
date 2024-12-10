import React from 'react'
import { InputMask } from 'primereact/inputmask'
import './InputMask.scss'
import Label from '../label/Label'

interface PropsInterface {
  inputtype: 'contactnumber' | 'inputMask'
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

export const InputMaskComponent: React.FC<PropsInterface> = (props) => {
  let inputElement = null
  switch (props.inputtype) {
    case 'contactnumber':
      inputElement = (
        <InputMask
          mask="(999) 999-9999"
          id={props.id + props.formName}
          value={props.value || ''}
          placeholder="(999) 999-9999"
          onChange={(e) => props.changed(e.value, props.id)}
          onBlur={() => props.blurred(props.id)}
          autoClear={false}
          unmask={true}
          disabled={props.disable}
        />
      )
      break

    case 'inputMask':
      inputElement = (
        <InputMask
          mask={props.customMask}
          id={props.id + props.formName}
          value={props.value || ''}
          placeholder={props.maskPlaceholder}
          onChange={(e) => props.changed(e.value, props.id)}
          onBlur={() => props.blurred(props.id)}
          autoClear={false}
          unmask={true}
          disabled={props.disable}
        />
      )
      break
  }
  return (
    <div className={'cstm-number-cls'}>
      {props.label && (
        <Label label={props.label} required={props.requiredLabel} />
        // <label htmlFor={props.id + props.formName}>{props.label}</label>
      )}
      {/* <label htmlFor={props.id + props.formName}>{props.label}</label> */}
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
