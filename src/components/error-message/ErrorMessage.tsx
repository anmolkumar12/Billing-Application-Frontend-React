import React, { useEffect, useState } from 'react'
import './ErrorMessage.scss'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const ErrorMessageComponent: React.FC<{
  fieldObj: any
  fieldKey: string
  updateValidity: any
  matchObj?: any
}> = ({ fieldObj, fieldKey, updateValidity, matchObj }) => {
  const rules = fieldObj.validation
  const [valid, setvalid] = useState(fieldObj.valid)
  const [errorMessage, seterrorMessage] = useState(fieldObj.errorMessage)

  useEffect(() => {
    let validFlag = true
    let currentErrorMessage = ''
    //set the error messages according to priority,required is priority 1
    if (
      rules.required &&
      (!fieldObj.value ||
        fieldObj.value === null ||
        (typeof fieldObj.value === 'string' && fieldObj.value.trim() === '') ||
        (Array.isArray(fieldObj.value) && !fieldObj.value.length))
    ) {
      validFlag = false
      currentErrorMessage = 'This is required'
    } else if (
      rules.minlength &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim().length < rules.minlength
    ) {
      validFlag = false
      currentErrorMessage = `Minlength is ${rules.minlength}`
    } else if (
      rules.email &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      !fieldObj.value
        .trim()
        .match('[a-zA-z_.+0-9-]+@[a-zA-Z0-9-]+([.][a-zA-Z0-9]+)+')
    ) {
      validFlag = false
      currentErrorMessage = 'Invalid Email'
    } else if (
      rules.pattern &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      !fieldObj.value.trim().match(rules.pattern)
    ) {
      validFlag = false
      currentErrorMessage =
        'Invalid Pattern' +
        (rules.patternHint ? ` (Hint : ${rules.patternHint})` : null)
    } else if (
      rules.maxlength &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim().length > rules.maxlength
    ) {
      validFlag = false
      currentErrorMessage = `Maxlength is ${rules.maxlength}`
    } else if (
      rules.min &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim() < rules.min
    ) {
      validFlag = false
      currentErrorMessage = `Min is ${rules.min}`
    } else if (
      rules.max &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim() > rules.max
    ) {
      validFlag = false
      currentErrorMessage = `Max is ${rules.max}`
    } else if (
      rules.match &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim() !== matchObj.value.trim()
    ) {
      validFlag = false
      currentErrorMessage = 'Match Failed'
    } else if (
      rules.maskFixedLength &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim().length !== rules.maskFixedLength
    ) {
      validFlag = false
      currentErrorMessage = `Required length is ${rules.maskFixedLength}`
    } else if (
      rules.maskMinLength &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim().length < rules.maskMinLength
    ) {
      validFlag = false
      currentErrorMessage = `Minlength is ${rules.maskMinLength}`
    } else if (
      rules.maskMaxLength &&
      fieldObj.value &&
      typeof fieldObj.value === 'string' &&
      fieldObj.value.trim() !== '' &&
      fieldObj.value.trim().length > rules.maskMaxLength
    ) {
      validFlag = false
      currentErrorMessage = `Maxlength is ${rules.maskMaxLength}`
    } else if (
      fieldObj.value &&
      fieldObj.value.length &&
      fieldObj.inputType === 'contactnumber' &&
      !isValidPhoneNumber(fieldObj.value)
    ) {
      validFlag = false
      currentErrorMessage = `Invalid Phone Number`
    }
    // else if (!valid) {
    //     setvalid(true);
    //     seterrorMessage(null);
    //     if (valid != fieldObj.valid && errorMessage != fieldObj.errorMessage) {
    //         updateValidity(valid, fieldKey, errorMessage);
    //     }
    // }

    if (valid !== validFlag || errorMessage !== currentErrorMessage) {
      setvalid(validFlag)
      seterrorMessage(currentErrorMessage)
      updateValidity(validFlag, fieldKey, currentErrorMessage)
    }
  })

  return !valid ? (
    <div className="custom-error">
      <span style={{ color: 'red', position: 'relative' }}>{errorMessage}</span>
    </div>
  ) : null
}
