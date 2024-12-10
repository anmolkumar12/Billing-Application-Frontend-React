/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Calendar } from 'primereact/calendar'
import Label from '../label/Label'
import './Calender.scss'

interface PropsInterface {
  inputtype: 'singleDatePicker' | 'monthPicker' | 'dateRange'
  label: string
  key: string
  value: any
  id: string
  changed: any
  blurred: any
  min?: string
  max?: string
  formName?: string
  disable?: boolean
  requiredLabel: boolean
}

export const CalendarComponent: React.FC<PropsInterface> = (props) => {
  let inputElement = null
  const mindate = props.min ? new Date(props.min) : undefined
  const maxdate = props.max ? new Date(props.max) : undefined

  switch (props.inputtype) {
    case 'singleDatePicker': {
      inputElement = (
        <Calendar
          id={props.id + props.formName}
          value={props.value || undefined}
          onChange={(e) => props.changed(e.value, props.id)}
          dateFormat="dd-mm-yy"
          readOnlyInput
          showIcon
          minDate={mindate}
          maxDate={maxdate}
          onBlur={() => props.blurred(props.id)}
          yearNavigator
          yearRange="1900:2030"
        ></Calendar>
      )

      break
    }

    case 'monthPicker': {
      inputElement = (
        <Calendar
          id={props.id + props.formName}
          value={props.value || undefined}
          onChange={(e) => props.changed(e.value, props.id)}
          view="month"
          dateFormat="MM"
          readOnlyInput
          showIcon
          onBlur={() => props.blurred(props.id)}
        />
      )
      break
    }

    case 'dateRange': {
      inputElement = (
        <Calendar
          id={props.id + props.formName}
          value={props.value || undefined}
          onChange={(e) => props.changed(e.value, props.id)}
          selectionMode="range"
          readOnlyInput
          showIcon
          onBlur={() => props.blurred(props.id)}
          style={{ width: '100%' }}
          baseZIndex={3000}
          dateFormat="dd-mm-yy"
        />
      )
      break
    }
  }
  return (
    <div className={'custom-cnder-cls'}>
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
