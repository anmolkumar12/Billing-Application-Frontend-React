/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import './Input.scss'
import { InputTextarea } from 'primereact/inputtextarea'
import Label from '../label/Label'
interface PropsInterface {
  inputtype: 'inputtext' | 'password' | 'inputtextarea'
  label: string
  key: string
  value: string | null
  id: string
  changed?: any
  blurred: any | undefined
  formName?: string
  disable?: boolean
  requiredLabel?: boolean
  rows?: number
  cols?: number
  autoResize?: boolean
  feedback?: boolean
  formikChanged?: any
}

export const InputComponent: React.FC<PropsInterface> = (props) => {
  let inputElement = null
  ;<Password
    id={props.id + props.formName}
    value={props.value || ''}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
      props.changed(e.target.value, props.id)
    }
    onBlur={() => props.blurred(props.id)}
    disabled={props.disable}
  />

  switch (props.inputtype) {
    case 'inputtext':
      inputElement = (
        <InputText
          id={props.id + (props.formName ? props.formName : '')}
          value={props.value || ''}
          onChange={
            props.formikChanged
              ? props.formikChanged
              : (e: React.ChangeEvent<HTMLInputElement>) =>
                  props.changed(e.target.value, props.id)
          }
          onBlur={props.blurred ? () => props.blurred(props.id) : undefined}
          disabled={props.disable}
          onKeyPress={(e) => (e.key == 'Enter' ? e.preventDefault() : {})}
        />
      )

      break

    case 'password':
      inputElement = (
        <Password
          id={props.id + props.formName}
          value={props.value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.changed(e.target.value, props.id)
          }
          onKeyPress={(event) =>
            event.key === ' ' ? event.preventDefault() : {}
          }
          onBlur={() => props.blurred(props.id)}
          disabled={props.disable}
          feedback={props.feedback}
          toggleMask
        />
      )
      break

    case 'inputtextarea':
      inputElement = (
        <InputTextarea
          id={props.id + props.formName}
          value={props.value || ''}
          rows={props.rows || 5}
          cols={props.cols || 30}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            props.changed(e.target.value, props.id)
          }
          onBlur={() => props.blurred(props.id)}
          disabled={props.disable}
          autoResize={props.autoResize}
        />
      )
  }
  return (
    <div className="input-custom-cls">
      {props.inputtype != 'inputtextarea' ? (
        <>
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
        </>
      ) : (
        <>
          {props.label && (
            <Label label={props.label} required={props.requiredLabel} />
            // <label htmlFor={props.id + props.formName}>{props.label}</label>
          )}
          <span
            className={
              'textarealabel ' + (props.requiredLabel ? 'required-label' : null)
            }
          >
            {inputElement}
          </span>
        </>
      )}
    </div>
  )
}
