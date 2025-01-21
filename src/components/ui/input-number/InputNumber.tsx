import React from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { InputNumberParameters } from '../../../schemas/FormField'
import classes from './InputNumber.module.scss'
import Label from '../label/Label'

interface PropsInterface {
  inputtype: 'inputNumber'
  label: string
  key: string
  value: number | null
  id: string
  changed: any
  formName: string
  inputNumberOptions: InputNumberParameters
  disable: boolean
  blurred: any
  requiredLabel: boolean
}

export const InputNumberComponent: React.FC<PropsInterface> = (props) => {
  return (
    <div className={'cstm-number-cls'}>
      {props.label && (
        <Label label={props.label} required={props.requiredLabel} />
        // <label htmlFor={props.id + props.formName}>{props.label}</label>
      )}
      <span
        className={
          'p-float-label ' + (props.requiredLabel ? 'required-label' : null)
        }
      >
        <InputNumber
          id={props.id + props.formName}
          value={props.value || undefined}
          onValueChange={(e) => props.changed(e.value, props.id)}
          prefix={props.inputNumberOptions?.prefix}
          suffix={props.inputNumberOptions?.suffix}
          min={props.inputNumberOptions?.min}
          max={props.inputNumberOptions?.max}
          minFractionDigits={props.inputNumberOptions.minFractionDigits || 0}
          maxFractionDigits={props.inputNumberOptions.maxFractionDigits || 0}
          mode={props.inputNumberOptions?.mode || 'decimal'}
          currency={props.inputNumberOptions?.currency}
          locale={props.inputNumberOptions?.locale}
          currencyDisplay={props.inputNumberOptions?.currencyDisplay}
          disabled={props.disable}
          useGrouping={false}
          onBlur={() => props.blurred(props.id)}
        />
      </span>
    </div>
  )
}
