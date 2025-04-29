/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
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

export const CalendarComponent: React.FC<PropsInterface> = React.memo((props) => {
  const mindate = useMemo(() => props.min ? new Date(props.min) : undefined, [props.min])
  const maxdate = useMemo(() => props.max ? new Date(props.max) : undefined, [props.max])

  const handleChange = useMemo(() => (e: any) => {
    props.changed(e.value, props.id)
  }, [props.changed, props.id])

  const handleBlur = useMemo(() => () => {
    props.blurred(props.id)
  }, [props.blurred, props.id])

  const inputElement = useMemo(() => {
    switch (props.inputtype) {
      case 'singleDatePicker': {
        return (
          <Calendar
            id={props.id + props.formName}
            value={props.value || undefined}
            onChange={handleChange}
            dateFormat="dd-mm-yy"
            readOnlyInput
            showIcon
            minDate={mindate}
            maxDate={maxdate}
            onBlur={handleBlur}
            yearNavigator
            yearRange="2000:2030"
            appendTo={document.body}
          />
        )
      }

      case 'monthPicker': {
        return (
          <Calendar
            id={props.id + props.formName}
            value={props.value || undefined}
            onChange={handleChange}
            view="month"
            dateFormat="MM"
            readOnlyInput
            showIcon
            onBlur={handleBlur}
            appendTo={document.body}
          />
        )
      }

      case 'dateRange': {
        return (
          <Calendar
            id={props.id + props.formName}
            value={props.value || undefined}
            onChange={handleChange}
            selectionMode="range"
            readOnlyInput
            showIcon
            onBlur={handleBlur}
            style={{ width: '100%' }}
            baseZIndex={3000}
            dateFormat="dd-mm-yy"
            appendTo={document.body}
          />
        )
      }
      default:
        return null
    }
  }, [props.inputtype, props.id, props.formName, props.value, mindate, maxdate, handleChange, handleBlur])

  return (
    <div className={'custom-cnder-cls'}>
      {props.label && (
        <Label label={props.label} required={props.requiredLabel} />
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
})

CalendarComponent.displayName = 'CalendarComponent'
