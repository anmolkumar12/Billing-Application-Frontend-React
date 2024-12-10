/* eslint-disable no-unexpected-multiline */
import React, { FormEvent, useEffect, useState } from 'react'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { CONSTANTS } from '../../constants/Constants'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import './SuperAdminManageUser.scss'
import classes from './SuperAdminManageUser.module.scss'
import { MasterService } from '../../services/master-service/master.service'
import { AuthService } from '../../services/auth-service/auth.service'
import _ from 'lodash'
import { FormComponent } from '../../components/ui/form/form'
import { FormType, updateOptionsObj } from '../../schemas/FormField'
import { ButtonComponent } from '../../components/ui/button/Button'
import { ManageUserService } from '../../services/manage-user-service/manage-user.service'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { patchForm } from '../../utils/PatchForm'
import { ManageUserModel } from '../../services/manage-user-service/manage-user.model'
import { ImageUrl } from '../../utils/ImageUrl'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { Chip } from 'primereact/chip'

const SuperAdminManageUser: React.FC = () => {
  // const masterService = new MasterService()
  const manageUserService = new ManageUserService()
  const [addUserPopup, setAddUserPopup] = useState(false)
  const [manageUserData, setManageUserData] = useState([])
  const [countryFilter, setCountryFilter] = useState([])
  const [stateListFilter, setStateListFilter] = useState([])
  const [cityFilterList, setCityFilterList] = useState([])
  const [updateOptionsObj, setUpdateOptionsObj] = useState<updateOptionsObj[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [editBrandPopup, setEditBrandPopup] = useState(false)
  const [rowData, setRowData] = useState<any>()
  const [clientFilter, setClientFilter] = useState([])
  const [attachments, setAttachments] = useState<any>([])
  const [fileUploaded, setFileUploaded] = useState<any>([])

  useEffect(() => {
    getManageUserData()
    // getCountryList()
    // getStateList()
    // getCityList()
    // getClientList()

    AuthService.adminAggregatorList$.subscribe((value: any) => {
      setClientFilter(value)
    })
    AuthService.countryList$.subscribe((value: any) => {
      setCountryFilter(value)
      addUserForm.countryId.options = value
    })
    AuthService.stateList$.subscribe((value: any) => {
      setStateListFilter(value)
      addUserForm.stateId.options = value
    })
    AuthService.cityList$.subscribe((value: any) => {
      setCityFilterList(value)
      addUserForm.cityId.options = value
    })
  }, [])

  // const getCountryList = () => {
  //   masterService
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setCountryFilter(response?.country)
  //       // setCurrencyFilter(response?.currency)
  //       addUserForm.countryId.options = response?.country
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getStateList = () => {
  //   masterService
  //     .stateList()
  //     .then((response: any) => {
  //       setStateListFilter(response)
  //       addUserForm.stateId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getCityList = () => {
  //   masterService
  //     .cityList()
  //     .then((response: any) => {
  //       setCityFilterList(response)
  //       addUserForm.cityId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getClientList = () => {
  //   new MasterService()
  //     .adminAggregatorList()
  //     .then((response: any) => {
  //       setClientFilter(response)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const getManageUserData = () => {
    manageUserService
      .manageUser()
      .then((response: any) => {
        setManageUserData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const buttonsArr = [
    {
      label: 'add',
      addFunction: () => onOperationClick(),
      tooltip: 'Add',
    },
  ]

  const onOperationClick = () => {
    setAddUserPopup(true)
  }

  const actionBody = (rowData: any) => {
    return (
      <>
        <img
          className="actionPencilImg"
          src={ImageUrl.ActionPencil}
          alt=""
          onClick={() => {
            OnActionClick(rowData)
          }}
        />
      </>
    )
  }

  // const getCompanyLogo = () => {
  //   new ManageUserService()
  //     .companyLogo()
  //     .then((res: any) => {
  //       console.log(res, 'companylogooooooo')
  //     })
  //     .catch((err: any) => {
  //       ToasterService.show(err, CONSTANTS.ERROR)
  //     })
  // }

  const OnActionClick = (rowData: any) => {
    console.log(rowData)
    // getCompanyLogo()
    // console.log('testng', addUserForm, rowData)
    setAddUserPopup(true)
    // setAddUserForm(true)
    setEditBrandPopup(true)
    setRowData(rowData)
    patchForm(
      addUserForm,
      new ManageUserModel().modifyManageUserData(rowData, addUserForm)
    )
    // setTimeout((form: FormType) => {
    //   formChanges(form, addUserForm)
    // }, 0)
  }

  const manageUserDataColumn = [
    {
      label: 'Action',
      fieldName: 'icon',
      textAlign: 'center',
      sort: false,
      filter: false,
      frozen: false,
      body: actionBody,
    },
    {
      label: 'Aggregator Name',
      fieldName: 'name',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: clientFilter?.length
          ? clientFilter.map((brand: any) => {
              return brand?.label
            })
          : [],
        fieldValue: 'aggregatorName',
        changeFilter: true,
        placeholder: 'Client',
      },
    },
    {
      label: 'Aggregator Email',
      fieldName: 'email',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Phone Number',
      fieldName: 'phoneNumber',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Company Name',
      fieldName: 'companyName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Company Website',
      fieldName: 'companyWebsite',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Company Address',
      fieldName: 'companyAddress',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Country',
      fieldName: 'countryName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
      dropDownFilter: {
        filterOptions: countryFilter?.length
          ? countryFilter.map((country: any) => {
              return country.label
            })
          : [],
        fieldValue: 'countryName',
        changeFilter: true,
        placeholder: 'Country',
      },
    },
    {
      label: 'State',
      fieldName: 'stateName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'City',
      fieldName: 'cityName',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Pin Code',
      fieldName: 'companyPincode',
      frozen: false,
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Register ID number',
      fieldName: 'registeredIdNumber',
      frozen: false,
      sort: true,
      width: '190px',
      textAlign: 'left',
      filter: true,
    },
  ]

  const addUserFormObj = {
    name: {
      inputType: 'inputtext',
      label: 'Name',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    companyName: {
      inputType: 'inputtext',
      label: 'Company Name',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    email: {
      inputType: 'inputtext',
      label: 'Email Id',
      value: null,
      validation: {
        email: true,
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    phoneNumber: {
      inputType: 'inputtext',
      label: 'Phone Number',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    companyWebsite: {
      inputType: 'inputtext',
      label: 'Company website',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-6',
    },
    companyAddress: {
      inputType: 'inputtext',
      label: 'Company Address',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    countryId: {
      inputType: 'singleSelect',
      label: 'Country',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      options: countryFilter,
      fieldWidth: 'col-md-4',
    },
    stateId: {
      inputType: 'singleSelect',
      label: 'State',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      options: stateListFilter,
      fieldWidth: 'col-md-4',
      disable: true,
    },
    cityId: {
      inputType: 'singleSelect',
      label: 'City',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      options: cityFilterList,
      fieldWidth: 'col-md-4',
      disable: true,
    },
    companyPincode: {
      inputType: 'inputtext',
      label: 'PIN Number',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    registeredIdNumber: {
      inputType: 'inputtext',
      label: 'Registered ID Number',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
  }

  const [addUserForm, setAddUserForm] = useState<any>(
    _.cloneDeep(addUserFormObj)
  )

  const addUserFormHandler = (form: FormType) => {
    formChanges(form, addUserForm)
    setAddUserForm(form)
  }

  const formChanges = (newForm: FormType, oldForm: FormType) => {
    // console.log('newwww', rowData)
    if (
      newForm?.countryId?.value &&
      newForm?.countryId?.value != oldForm?.countryId?.value
    ) {
      newForm.stateId.disable = false
      const statesList: any[] =
        stateListFilter.filter(
          (item: any) => item.countryId == newForm.countryId.value
        ) || []
      newForm.stateId.options = statesList
      if (statesList && statesList.length) {
        const stateObj = _.find(statesList, {
          value: newForm.stateId.value,
        })
        newForm.stateId.value = (stateObj && stateObj.value) || null
        if (!newForm.stateId.value) {
          newForm.cityId.value = null
          newForm.cityId.disable = true
          newForm.cityId.options = []
        }
      }
    }
    //  else {
    //   newForm.stateId.disable = false
    //   const statesList: any[] =
    //     stateListFilter.filter(
    //       (item: any) => item.countryId == newForm.countryId.value
    //     ) || []
    //   newForm.stateId.options = statesList
    //   if (statesList && statesList.length) {
    //     const stateObj = _.find(statesList, {
    //       value: newForm.stateId.value,
    //     })
    //     newForm.stateId.value = (stateObj && stateObj.value) || null
    //     if (!newForm.stateId.value) {
    //       newForm.cityId.value = rowData?.stateId
    //       newForm.cityId.disable = true
    //       newForm.cityId.options = []
    //     }
    //   }
    // }

    if (
      newForm?.stateId?.value &&
      newForm?.stateId?.value !== oldForm?.stateId?.value
    ) {
      newForm.cityId.disable = false
      const cityList: any[] =
        cityFilterList.filter(
          (item: any) => item.stateId == newForm.stateId.value
        ) || []
      newForm.cityId.options = cityList
      if (cityList && cityList.length) {
        const cityObj = _.find(cityList, { value: newForm.cityId.value })
        newForm.cityId.value = (cityObj && cityObj.value) || null
      }
    }
    // else {
    //   newForm.cityId.disable = false
    //   const cityList: any[] =
    //     cityFilterList.filter(
    //       (item: any) => item.stateId == newForm.stateId.value
    //     ) || []
    //   newForm.cityId.options = cityList
    //   if (cityList && cityList.length) {
    //     const cityObj = _.find(cityList, { value: newForm.cityId.value })
    //     newForm.cityId.value = (cityObj && cityObj.value) || null
    //   }
    // }
  }

  const onSubmitUserForm = () => {
    editBrandPopup ? updateManageUser() : addManageUser()
  }

  const addManageUser = () => {
    let addUserFormValidityFlag = true
    const adduserFromValid: boolean[] = []
    _.each(addUserForm, (item: any) => {
      if (item.required) {
        adduserFromValid.push(item.valid)
        addUserFormValidityFlag = addUserFormValidityFlag && item.valid
      }
    })
    setIsFormValid(addUserFormValidityFlag)
    if (addUserFormValidityFlag) {
      const formData: any = new FormData()
      const Obj = {
        name: addUserForm?.name?.value,
        email: addUserForm?.email?.value,
        phoneNumber: addUserForm?.phoneNumber?.value,
        companyName: addUserForm?.companyName?.value,
        companyWebsite: addUserForm?.companyWebsite?.value,
        companyAddress: addUserForm?.companyAddress?.value,
        companyPincode: addUserForm?.companyPincode?.value,
        registeredIdNumber: addUserForm?.registeredIdNumber?.value,
        countryId: addUserForm?.countryId?.value,
        stateId: addUserForm?.stateId?.value,
        cityId: addUserForm?.cityId?.value,
      }
      Object.entries(Obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      attachments?.length && formData.set('file', attachments[0])
      setLoading(true)
      manageUserService
        .addUser(formData)
        .then((response: any) => {
          setLoading(false)
          if (response?.status == HTTP_RESPONSE.SUCCESS) {
            closePaymentPopup()
            getManageUserData()
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          setLoading(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      setLoading(false)
      ToasterService.show('Please Check all the Fields!', CONSTANTS.ERROR)
    }
  }

  const updateManageUser = () => {
    let addUserFormValidityFlag = true
    const adduserFromValid: boolean[] = []
    _.each(addUserForm, (item: any) => {
      adduserFromValid.push(item.valid)
      addUserFormValidityFlag = addUserFormValidityFlag && item.valid
    })
    setIsFormValid(addUserFormValidityFlag)
    if (editBrandPopup) {
      const formData: any = new FormData()
      const Obj = {
        // id: rowData?.id,
        clientId: rowData?.clientId,
        name: addUserForm?.name?.value,
        email: addUserForm?.email?.value,
        phoneNumber: addUserForm?.phoneNumber?.value,
        companyName: addUserForm?.companyName?.value,
        companyWebsite: addUserForm?.companyWebsite?.value,
        companyAddress: addUserForm?.companyAddress?.value,
        companyPincode: addUserForm?.companyPincode?.value,
        registeredIdNumber: addUserForm?.registeredIdNumber?.value,
        countryId: addUserForm?.countryId?.value,
        stateId: addUserForm?.stateId?.value,
        cityId: addUserForm?.cityId?.value,
      }
      Object.entries(Obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      setLoading(true)
      if (attachments?.length) {
        formData.set('file', attachments[0])
      } else {
        formData.set('logo', rowData?.companyLogo || null)
      }
      manageUserService
        .editUser(formData)
        .then((response: any) => {
          if (response?.status == HTTP_RESPONSE.SUCCESS) {
            setLoading(false)
            closePaymentPopup()
            getManageUserData()
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          setLoading(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      ToasterService.show('Please Check all the Fields!', CONSTANTS.ERROR)
    }
  }

  const closePaymentPopup = () => {
    setAddUserPopup(false)
    setEditBrandPopup(false)
    setAddUserForm(_.cloneDeep(addUserFormObj))
    setAttachments([])
    setFileUploaded([])
  }

  const selectAttachment = (event1: any, event: any) => {
    const newEvent: any = [],
      newEvent1: any = []
    Array.prototype.push.apply(newEvent, event)
    Array.prototype.push.apply(newEvent1, event1.target.files)

    if (event && event1) {
      const fileType = event[0].name
        .split('.')
        [event[0].name.split('.').length - 1].toLowerCase()
      if (
        FILE_TYPES.SVG != fileType &&
        FILE_TYPES.JPEG != fileType &&
        FILE_TYPES.JPG != fileType &&
        FILE_TYPES.PNG != fileType
      ) {
        ToasterService.show(
          `Invalid logo format.The allowed logo format is jpeg,jpg,png`,
          CONSTANTS.ERROR
        )
        newEvent.splice(0, 1)
        newEvent1.splice(0, 1)
        return true
      }
      const invalidSizeIndex = _.findIndex(event, (item: any) => {
        return item.size > 10485760
      })

      if (invalidSizeIndex > -1) {
        ToasterService.show(
          `File size is too large for file ${
            invalidSizeIndex + 1
          }, allowed maximum size is 5 MB.`,
          'error'
        )
        newEvent.splice(invalidSizeIndex, 1)
        newEvent1.splice(invalidSizeIndex, 1)
      }
      if (newEvent1 && newEvent1.length) {
        const filesAmount = newEvent1.length
        for (let i = 0; i < filesAmount; i++) {
          const reader = new FileReader()
          reader.onload = (event: any) => {
            setFileUploaded([event['target'].result])
          }
          reader.readAsDataURL(newEvent1[i])
        }
      }

      _.values(newEvent).map((item) => {
        setAttachments([item])
      })
    }
  }

  const removeFileHandler = () => {
    setAttachments([])
    setFileUploaded([])
  }

  const removeLogoFromRowData = () => {
    const data: any = JSON.parse(JSON.stringify(rowData))
    data.brandLogo = null
    setRowData(data)
    // console.log('rowData.brandLogo', rowData.brandLogo)
    rowData.brandLogo = null
  }

  return (
    <>
      <div className={classes['manage-user-body']}>
        <DataTableBasicDemo
          customClass="superAdminManageUserTable"
          data={manageUserData}
          column={manageUserDataColumn}
          buttonArr={buttonsArr}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          downloadedfileName={'ManageUserData'}
          scrollHeight={'calc(100vh - 65px)'}
        />

        {addUserPopup ? (
          <div className="popup-overlay">
            <div
              className="popup-body stretchLeft"
              style={{
                left: AuthService?.sideNavCollapse?.value ? '70px' : '200px',
                width: AuthService?.sideNavCollapse?.value
                  ? 'calc(100% - 70px)'
                  : 'calc(100% - 200px)',
              }}
            >
              <div className="popup-header">
                <div
                  className="popup-close"
                  onClick={() => {
                    closePaymentPopup()
                  }}
                >
                  <i className="pi pi-angle-left"></i>
                  <h4 className="popup-heading">
                    {editBrandPopup}
                    {editBrandPopup ? 'Edit User' : 'Add User'}
                  </h4>
                </div>
                <div
                  className="popup-right-close"
                  onClick={() => {
                    closePaymentPopup()
                  }}
                >
                  &times;
                </div>
              </div>
              <div className="popup-content">
                <FormComponent
                  customClassName="boxFieldsss rwm manageUserFromClass"
                  form={_.cloneDeep(addUserForm)}
                  formUpdateEvent={addUserFormHandler}
                  isFormValidFlag={isFormValid}
                  updateOptions={updateOptionsObj}
                ></FormComponent>

                {/* attachment */}
                <div className={classes['upload-wrapper']}>
                  <label htmlFor="">
                    Upload Logo
                    {/* <span style={{ color: 'red' }}>*</span> */}
                  </label>
                  <div className="row mx-0 my-2">
                    <div className="col-md-12 p-0">
                      <div
                        className={
                          classes['upload-file-section'] + ' ' + 'd-flex p-4'
                        }
                      >
                        <div className={classes['upload-file'] + ' ' + 'pl-2'}>
                          <input
                            type="file"
                            onClick={(event: any) => {
                              event.target.value = null
                            }}
                            onChange={(e) =>
                              selectAttachment(e, e.target.files)
                            }
                          />
                          <p>
                            Drag files here <br />
                            <u>
                              Support 240px width * 80px height. File type: JPEG
                              or PNG
                            </u>
                          </p>
                        </div>
                        {/* <div className={classes['chip-tm']}>
                          {fileUploaded?.length ? (
                            <div className={classes['img-preview']}>
                              {fileUploaded.map((item: any) => {
                                return (
                                  <>
                                    <img
                                      crossOrigin="anonymous"
                                      src={item}
                                      alt="Company Logo"
                                    />
                                    <div
                                      className={classes['close-img-preview']}
                                      onClick={() => removeFileHandler()}
                                    >
                                      &times;
                                    </div>
                                  </>
                                )
                              })}
                            </div>
                          ) : editBrandPopup && rowData?.companyLogo ? (
                            <div className={classes['img-preview']}>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.companyLogo}`}
                                style={{
                                  verticalAlign: 'middle',
                                  paddingRight: '2px',
                                }}
                                width={150}
                                alt="Company Logo"
                              />
                              <div
                                className={classes['close-img-preview']}
                                onClick={() => removeLogoFromRowData()}
                              >
                                &times;
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className={classes['img-preview']}>
                                <img src={ImageUrl.AttachmentClip} alt="" />
                              </div>
                            </>
                          )}
                        </div> */}

                        <div className={classes['chip-tm']}>
                          {fileUploaded?.length ? (
                            <div className={classes['img-preview']}>
                              {fileUploaded.map((item: any) => {
                                return (
                                  <>
                                    <img
                                      crossOrigin="anonymous"
                                      src={item}
                                      alt="Company Logo"
                                    />
                                    <div
                                      className={classes['close-img-preview']}
                                      onClick={() => removeFileHandler()}
                                    >
                                      &times;
                                    </div>
                                  </>
                                )
                              })}
                            </div>
                          ) : editBrandPopup && rowData?.companyLogo ? (
                            <div className={classes['img-preview']}>
                              <img
                                crossOrigin="anonymous"
                                src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.companyLogo}`}
                                style={{
                                  verticalAlign: 'middle',
                                  paddingRight: '2px',
                                }}
                                width={150}
                                alt="Profile Pic"
                              />
                              <div
                                className={classes['close-img-preview']}
                                onClick={() => removeLogoFromRowData()}
                              >
                                &times;
                              </div>
                            </div>
                          ) : // (
                          //   <div>
                          //     <Chip
                          //       label={rowData?.companyLogo}
                          //       removable
                          //       onRemove={() => removeLogoFromRowData()}
                          //     />
                          //   </div>
                          // )
                          null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* attachment */}
              </div>
              <div className="popup-lower-btn">
                <ButtonComponent
                  label="Submit"
                  icon="pi pi-check"
                  iconPos="right"
                  apihitting={loading}
                  submitEvent={onSubmitUserForm}
                />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
export default SuperAdminManageUser
