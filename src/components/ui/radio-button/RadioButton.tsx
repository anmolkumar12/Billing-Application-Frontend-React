import React from 'react'
import { RadioButton } from 'primereact/radiobutton'
import './RadioButton.scss'
import { RadioOptionsInteface } from '../../../schemas/FormField'

interface PropsInterface {
  inputtype: 'radio'
  label?: string
  labelPosition?: string
  key: string
  value: string | number | null
  id: string
  changed: any
  radioOptions: RadioOptionsInteface[]
  formName: string
  horizontal?: boolean
}

export const RadioButtonComponent: React.FC<PropsInterface> = (props) => {
  return (
    <div
      className="cstm-radiobutton"
      style={
        props.labelPosition == 'left'
          ? { display: 'flexxc' }
          : { display: 'block' }
      }
    >
      {props.label ? (
        <span
          style={
            props.labelPosition == 'left'
              ? { marginRight: '10px' }
              : { marginRight: '0px' }
          }
        >
          {props.label}
        </span>
      ) : null}
      <div style={{ display: props.horizontal ? 'flex' : 'block' }}>
        {props.radioOptions.map((item) => {
          return (
            <div key={item.value} className="p-field-radiobutton">
              <RadioButton
                inputId={item.value + props.formName}
                name={props.id}
                value={item.value}
                onChange={(e) => props.changed(e.value, props.id)}
                checked={props.value === item.value}
              />
              <label htmlFor={item.value + props.formName}>{item.label}</label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
