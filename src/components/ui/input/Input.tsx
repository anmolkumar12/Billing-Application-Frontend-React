/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import './Input.scss';
import Label from '../label/Label';

interface PropsInterface {
  inputtype: 'inputtext' | 'password' | 'inputtextarea';
  label: string;
  key: string;
  value: string | null;
  id: string;
  changed?: any;
  blurred: any | undefined;
  formName?: string;
  disable?: boolean;
  requiredLabel?: boolean;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
  feedback?: boolean;
  formikChanged?: any;
}

export const InputComponent: React.FC<PropsInterface> = (props) => {
  // const controlledByFormikIds = ['company_name', 'financialYearName']; // Add all ids you want
  // const isControlledByFormik = controlledByFormikIds.includes(props.id);
  
  // 1. when a input text field don't have props.disabled then focus out functionality in input text fiels will work which will not cause re-rendering and lag.
  // 2  when a input text field have props.disabled means it need to patch the value when other field value change props.disable will make them to run wihtout focus off which will not create a issue of displaying input text patch value in add new time
  const [localValue, setLocalValue] = useState(props.value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (props.disable) {
      if (props.formikChanged) {
        props.formikChanged(e);
      } else if (props.changed) {
        props.changed(value, props.id);
      }
    } else {
      setLocalValue(value);
    }
  };

  const handleBlur = () => {
    if (props.disable) {
      if (props.blurred) props.blurred(props.id);
    } else {
      if (props.changed) props.changed(localValue, props.id);
      if (props.blurred) props.blurred(props.id);
    }
  };

  const inputValue = props.disable ? props.value || '' : localValue;

  let inputElement = null;

  switch (props.inputtype) {
    case 'inputtext':
      inputElement = (
        <InputText
          id={props.id + (props.formName || '')}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={props.disable}
          onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
        />
      );
      break;

    case 'password':
      inputElement = (
        <Password
          id={props.id + (props.formName || '')}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={(e) => e.key === ' ' && e.preventDefault()}
          disabled={props.disable}
          feedback={props.feedback}
          toggleMask
        />
      );
      break;

    case 'inputtextarea':
      inputElement = (
        <InputTextarea
          id={props.id + (props.formName || '')}
          value={inputValue}
          rows={props.rows || 5}
          cols={props.cols || 30}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={props.disable}
          autoResize={props.autoResize}
        />
      );
      break;

    default:
      inputElement = null;
  }

  return (
    <div className="input-custom-cls">
      {props.label && <Label label={props.label} required={props.requiredLabel} />}
      <span
        className={
          (props.inputtype === 'inputtextarea' ? 'textarealabel ' : 'p-float-label ') +
          (props.requiredLabel ? 'required-label' : '')
        }
      >
        {inputElement}
      </span>
    </div>
  );
};
