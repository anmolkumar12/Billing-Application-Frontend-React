import { FormType } from '../schemas/FormField'

export const patchForm = (form: FormType, data: any) => {
  Object.entries(form).forEach(([key, value]) => {
    if (Object.keys(data).indexOf(key) > -1) {
      value.value = data[key]
      if (
        value &&
        value.validation &&
        value.validation?.required &&
        !value.value
      ) {
        value.valid = false
      } else {
        value.errorMessage = null
        value.valid = true

        // updateValidityHandler(true, key, '');
      }
    }
  })
  return form
}

export const updateValidityAfterPatch = (form: FormType) => {
  Object.entries(form).forEach(([key, value]) => {
    if (
      value &&
      value.validation &&
      value.validation?.required &&
      !value.value
    ) {
      value.valid = false
    } else {
      value.errorMessage = null
      value.valid = true
    }
  })
  return form
}
