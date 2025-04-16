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
  const [localValue, setLocalValue] = useState(props.value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    if (props.changed) {
      props.changed(localValue, props.id);
    }
    if (props.blurred) {
      props.blurred(props.id);
    }
  };

  let inputElement = null;

  switch (props.inputtype) {
    case 'inputtext':
      inputElement = (
        <InputText
          id={props.id + (props.formName ? props.formName : '')}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={props.disable}
          onKeyPress={(e) => (e.key === 'Enter' ? e.preventDefault() : {})}
        />
      );
      break;

    case 'password':
      inputElement = (
        <Password
          id={props.id + props.formName}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyPress={(event) => (event.key === ' ' ? event.preventDefault() : {})}
          disabled={props.disable}
          feedback={props.feedback}
          toggleMask
        />
      );
      break;

    case 'inputtextarea':
      inputElement = (
        <InputTextarea
          id={props.id + props.formName}
          value={localValue}
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
      {props.inputtype !== 'inputtextarea' ? (
        <>
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
        </>
      ) : (
        <>
          {props.label && (
            <Label label={props.label} required={props.requiredLabel} />
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
  );
};
