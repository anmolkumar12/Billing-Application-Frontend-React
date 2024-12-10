import { FormType, optionsObj } from '../schemas/FormField'
import * as _ from 'lodash'

export const checkFormValidity = (form: FormType) => {
  let valid = true
  Object.entries(form).forEach(([key, value]) => {
    // if (!value.valid || !value.touched) {
    if (!value.valid && value.validation && !value.hideField) {
      valid = valid && false
    }
  })
  return valid
}

export const showHideOthersTextField = (
  oldForm: FormType,
  newform: FormType,
  idKey: string,
  textKey: string,
  optionsArray: optionsObj[],
  showFieldWidth?: string,
  hideFieldWidth?: string
) => {
  if (oldForm[idKey].value !== newform[idKey].value) {
    const othersObj = _.find(optionsArray, { label: 'Others' })
    if (othersObj && othersObj.value === newform[idKey].value) {
      newform[textKey].hideField = false
      newform[textKey].value = newform[textKey].value || null
      if (showFieldWidth) newform[idKey].fieldWidth = showFieldWidth
    } else {
      newform[textKey].hideField = true
      newform[textKey].value = null
      if (hideFieldWidth) newform[idKey].fieldWidth = hideFieldWidth
    }
  }
}
