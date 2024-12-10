import React from 'react'
import { InputSwitch } from 'primereact/inputswitch'
import './InputSwitch.scss'

interface PropsInterface {
  inputtype: 'inputSwitch'
  label?: string | null | undefined
  key: string
  value: boolean | null
  id: string
  changed: any
  blurred: any
  formName?: string
  disable: boolean
  requiredLabel: boolean
}

export const InputSwitchComponent: React.FC<PropsInterface> = (props) => {
  let inputElement = null

  switch (props.inputtype) {
    case 'inputSwitch':
      inputElement = (
        <InputSwitch
          id={props.id + props.formName}
          checked={props.value || false}
          onChange={(e) => props.changed(e.value, props.id)}
          disabled={props.disable}
        />
      )
      break
  }
  return (
    <div className={'cstm-switch-cls'}>
      <span
        className={
          'p-float-label ' + (props.requiredLabel ? 'required-label' : null)
        }
      >
        {inputElement}
        {props.label ? (
          <label htmlFor={props.id + props.formName}>{props.label}</label>
        ) : null}
      </span>
    </div>
  )
}
