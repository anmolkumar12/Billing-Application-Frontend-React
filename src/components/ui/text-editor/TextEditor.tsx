import React, { useState } from 'react'
import { Editor } from 'primereact/editor'
import Label from '../label/Label'

interface EditorProps {
  inputtype: 'textArea'
  toolbarHidden?: boolean
  onContentStateChange?: any
  id?: string
  label?: string
  required?: boolean
  optionalLabel?: string
  value?: any
  readOnly?: boolean
  error?: string | undefined
  touched?: boolean | undefined
}

export const TextEditor: React.FC<EditorProps> = (props) => {
  const {
    onContentStateChange,
    id,
    label,
    required,
    optionalLabel,
    value,
    readOnly = false,
    error,
    touched,
  } = props
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
  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    )
  }

  const header = renderHeader()
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

  return (
    <div>
      <Label label={label} required={required} optionalLabel={optionalLabel} />
      <Editor
        style={{ height: '160px' }}
        value={value}
        onTextChange={(e) => onContentStateChange(e, id)}
        readOnly={readOnly}
      />
      {getErrorMessage() && (
        <div style={getErrorMessageStyle()}>{getErrorMessage()}</div>
      )}
    </div>
  )
}
// export default TextEditor
