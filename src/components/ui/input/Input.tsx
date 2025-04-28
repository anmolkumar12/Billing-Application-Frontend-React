import React, { useState, useRef, useEffect } from 'react';
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
  const hasFirstInputHappened = useRef(false);
  useEffect(() => {
    if (!hasFirstInputHappened.current) {
      setLocalValue(props.value || '');
    }
  }, [props.value]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalValue(value); // Always update local value
    if (!hasFirstInputHappened.current) {
      hasFirstInputHappened.current = true;
    }
  
    if (props.formikChanged) {
      props.formikChanged(e); // Let Formik handle touched etc.
    }
  };
  
  const handleBlur = () => {
    if (props.changed) {
      props.changed(localValue, props.id); // Always fire changed on blur
    }
    if (props.blurred) {
      props.blurred(props.id);
    }
  };

  const inputValue = hasFirstInputHappened.current ? localValue : props.value || '';

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
