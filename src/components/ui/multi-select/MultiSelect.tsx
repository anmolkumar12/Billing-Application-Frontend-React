import React from 'react'
import { MultiSelect } from 'primereact/multiselect'
import './MultiSelect.scss'
import { optionsObj } from '../../../schemas/FormField'
import Label from '../label/Label'

// interface optionsObj {
//     label: string;
//     value: string;
// }

interface PropsInterface {
  inputtype: 'multiSelect'
  label?: string
  key: string
  value: string[] | null
  id: string
  changed: any
  blurred: any
  options: optionsObj[]
  formName?: string
  disable: boolean
  requiredLabel: boolean
  labelRequire?: boolean
}

export const MultiSelectComponent: React.FC<PropsInterface> = (props) => {
  let inputElement = null
  const { labelRequire = false } = props

  switch (props.inputtype) {
    case 'multiSelect':
      inputElement = (
        <MultiSelect
          id={props.id + props.formName}
          value={props.value}
          options={props.options}
          onChange={(e) => props.changed(e.value, props.id)}
          onBlur={() => props.blurred(props.id)}
          filter
          disabled={props.disable}
          className="container"
        />
      )

      break
  }
  return (
    <div className="custom-multiselect">
      {props.label ? (
        <Label label={props.label} required={props.requiredLabel} />
      ) : null}
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
