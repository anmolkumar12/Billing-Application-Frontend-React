/* eslint-disable no-unexpected-multiline */
import _ from 'lodash'
import React, { FormEvent, useEffect, useState } from 'react'
import { FormComponent } from '../../components/ui/form/form'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { CONSTANTS } from '../../constants/Constants'
import { AggregatorManageUserService } from '../../services/aggregator-manage-user-service/aggregator-manage-user.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import './AggregatorManageUser.scss'
import classes from './AggregatorManageUser.module.scss'
import { FormType, updateOptionsObj } from '../../schemas/FormField'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { patchForm } from '../../utils/PatchForm'
import { ButtonComponent } from '../../components/ui/button/Button'
import { ImageUrl } from '../../utils/ImageUrl'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { Chip } from 'primereact/chip'
import { AuthService } from '../../services/auth-service/auth.service'
import { MasterService } from '../../services/master-service/master.service'

const AggregatorManageUser: React.FC = () => {
  const [userData, setUserData] = useState([])
  const [addUserPopup, setAddUserPopup] = useState(false)
  const [editUserPopup, setEditUserPopup] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [updateOptionsObj, setUpdateOptionsObj] = useState<updateOptionsObj[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const [rowData, setRowData] = useState<any>()
  const [attachments, setAttachments]: any = useState([])
  const [fileUploaded, setFileUploaded] = useState<any>([])
  const [allClients, setAllClients] = useState([])
  const aggregatorManageUserService = new AggregatorManageUserService()

  useEffect(() => {
    getAggregatorUser()
    AuthService.clientList$.subscribe((value: any) => {
      setAllClients(value)
    })
  }, [])

  const getAggregatorUser = () => {
    aggregatorManageUserService
      .aggregatorUserData()
      .then((response: any) => {
        // console.log('aggregator user data', response)
        setUserData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const buttonsArr = [
    {
      label: 'Add User',
      addFunction: () => onOperationClick(),
      tooltip: 'Add User',
    },
  ]

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

  const OnActionClick = (rowData: any) => {
    console.log('RowData', rowData)
    setAddUserPopup(true)
    setEditUserPopup(true)
    setRowData(rowData)
    patchForm(addUserForm, rowData)
  }

  const onOperationClick = () => {
    setAddUserPopup(true)
    setEditUserPopup(false)
    setAddUserForm(_.cloneDeep(addUserFormObj))
  }

  const addUserFormObj = {
    name: {
      inputType: 'inputtext',
      label: 'Name',
      value: null,
      validation: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
      fieldWidth: 'col-md-12',
    },
    email: {
      inputType: 'inputtext',
      label: 'Email',
      value: null,
      validation: {
        email: true,
        required: true,
        minlength: 3,
        maxlength: 100,
      },
      fieldWidth: 'col-md-6',
    },
    phoneNumber: {
      inputType: 'contactnumber',
      label: 'Phone Number',
      value: null,
      validation: {
        required: true,
        minlength: 7,
        maxlength: 15,
      },
      fieldWidth: 'col-md-6',
    },
  }

  const [addUserForm, setAddUserForm] = useState<any>(
    _.cloneDeep(addUserFormObj)
  )

  const addUserFormHandler = (form: FormType) => {
    setAddUserForm(form)
  }

  const userDataColumn = [
    {
      label: 'Action',
      fieldName: '',
      textAlign: 'center',
      width: '140px',
      sort: false,
      filter: false,
      body: actionBody,
    },
    {
      label: 'Name',
      fieldName: 'name',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: allClients?.length
          ? allClients.map((client: any) => {
              return client.label
            })
          : [],
        fieldValue: 'name',
        changeFilter: true,
        placeholder: 'Name',
      },
    },
    {
      label: 'Email',
      fieldName: 'email',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
    {
      label: 'Phone Number',
      fieldName: 'phoneNumber',
      textAlign: 'left',
      sort: true,
      filter: true,
    },
  ]

  const addUserSubmitHandler = (event?: FormEvent) => {
    if (event) {
      event.preventDefault()
    }
    let addUserFormValidityFlag = true
    const addUserFromValid: boolean[] = []
    _.each(addUserForm, (item: any) => {
      if (item?.validation?.required) {
        addUserFromValid.push(item.valid)
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
      }
      Object.entries(Obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      if (attachments?.length) {
        formData.set('file', attachments[0])
      }
      setLoading(true)
      aggregatorManageUserService
        .addUser(formData)
        .then((response: any) => {
          if (response.status === HTTP_RESPONSE.SUCCESS) {
            setLoading(false)
            setAddUserPopup(false)
            getAggregatorUser()
            close()
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
            new MasterService().clientList().then((response: any) => {
              AuthService.clientList$.next(response)
            })
          }
        })
        .catch((error: any) => {
          setLoading(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    } else {
      setLoading(false)
      ToasterService.show('Please Check all the Fields !', CONSTANTS.ERROR)
    }
  }

  const editUserSubmitHandler = (event?: FormEvent) => {
    if (event) {
      event.preventDefault()
    }
    let addUserFormValidityFlag = true
    const addUserFromValid: boolean[] = []
    _.each(addUserForm, (item: any) => {
      addUserFromValid.push(item.valid)
      addUserFormValidityFlag = addUserFormValidityFlag && item.valid
    })
    setIsFormValid(addUserFormValidityFlag)
    if (addUserFormValidityFlag) {
      const formData: any = new FormData()
      const Obj: any = {
        clientId: rowData?.clientId,
        name: addUserForm?.name?.value,
        email: addUserForm?.email?.value,
        phoneNumber: addUserForm?.phoneNumber?.value,
      }
      // if (!attachments?.length) {
      //   Obj['profilePic'] = rowData?.profilePic
      // }
      setLoading(true)
      Object.entries(Obj).forEach(([key, value]: any) => {
        formData.set(key, value)
      })
      if (!attachments?.length && !rowData?.profilePic) {
        return ToasterService.show('Please Upload Profile Pic', CONSTANTS.ERROR)
      }
      if (attachments?.length) {
        formData.set('file', attachments[0])
      } else {
        formData.set('profilePic', rowData?.profilePic)
      }
      aggregatorManageUserService
        .editUser(formData)
        .then((response: any) => {
          if (response.status === HTTP_RESPONSE.SUCCESS) {
            setLoading(false)
            setAddUserPopup(false)
            getAggregatorUser()
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

  const close = () => {
    setEditUserPopup(false)
    setAddUserPopup(false)
    setRowData(null)
    setAddUserForm(_.cloneDeep(addUserFormObj))
    setAttachments([])
    setFileUploaded([])
  }

  // const selectAttachment = (files: any) => {
  //   setAttachments([])
  //   if (files && files[0]) {
  //     _.each(files, (eventList) => {
  //       if (
  //         eventList.name
  //           .split('.')
  //           [eventList.name.split('.').length - 1].toLowerCase() ==
  //           FILE_TYPES.PDF ||
  //         eventList.name
  //           .split('.')
  //           [eventList.name.split('.').length - 1].toLowerCase() ==
  //           FILE_TYPES.JPG ||
  //         eventList.name
  //           .split('.')
  //           [eventList.name.split('.').length - 1].toLowerCase() ==
  //           FILE_TYPES.PNG ||
  //         eventList.name
  //           .split('.')
  //           [eventList.name.split('.').length - 1].toLowerCase() ==
  //           FILE_TYPES.JPEG
  //       ) {
  //         if (eventList.size > 10485760) {
  //           return ToasterService.show(
  //             'file size is too large, allowed maximum size is 10 MB.',
  //             'error'
  //           )
  //         } else {
  //           setAttachments((prevVals: any) => [...prevVals, eventList])
  //         }
  //       } else {
  //         ToasterService.show(
  //           `Invalid file format you can only attach the pdf here!`,
  //           'error'
  //         )
  //         eventList = null
  //       }
  //     })
  //   }
  // }

  const removeFileHandler = () => {
    // const data: any = JSON.parse(JSON.stringify(rowData))
    // console.log(data, 'in removeFileHandler')
    // data.profilePic = null
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

  const removeLogoFromRowData = () => {
    const data: any = JSON.parse(JSON.stringify(rowData))
    console.log(data, 'in removeLogoFromRowData')
    data.profilePic = null
    setRowData(data)
    rowData.profilePic = null
  }

  return (
    <>
      <div className={classes['manage-user-body']}>
        <DataTableBasicDemo
          customClass="aggregatorManageUserTable"
          data={userData}
          column={userDataColumn}
          showGridlines={true}
          resizableColumns={true}
          buttonArr={buttonsArr}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          downloadedfileName={'UserData'}
          scrollHeight={'calc(100vh - 65px)'}
        />
      </div>
      {addUserPopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header ">
              <div
                className="popup-close"
                onClick={() => {
                  close()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">
                  {editUserPopup ? <>Edit User</> : <>Add User</>}
                </h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  close()
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
              {/* <div className={classes['upload-wrapper']}>
                <label>Upload File</label>
                <div className="row">
                  <div className="col-md-12">
                    <div className={classes['upload-file-section']}>
                      <div className={classes['upload-file']}>
                        <input
                          type="file"
                          onClick={(event: any) => {
                            event.target.value = null
                          }}
                          onChange={(e) => selectAttachment(e.target.files)}
                          className={classes['upload']}
                        />
                        <img src={ImageUrl.FolderIconImage} />
                        <p>
                          Drag files here <span> or browse</span> <br />
                          <u>Support PDF</u>
                        </p>
                        <div className={classes['chip-tm']}>
                          {attachments?.length ? (
                            attachments.map((item: any, index: any) => {
                              return (
                                <Chip
                                  label={item?.name}
                                  removable
                                  onRemove={() => removeFileHandler()}
                                  key={index}
                                />
                              )
                            })
                          ) : editUserPopup && rowData?.profilePic ? (
                            <div>
                              <Chip
                                label={rowData?.profilePic}
                                removable
                                onRemove={() => removeFileHandler()}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* attachment */}

              {/* attachment */}
              <div className={classes['upload-wrapper']}>
                <label htmlFor="">
                  Upload Profile
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
                          onChange={(e) => selectAttachment(e, e.target.files)}
                        />
                        <p>
                          Drag files here <br />
                          <u>
                            Support 240px width * 80px height. File type: JPG,
                            JPEG or PNG
                          </u>
                        </p>
                      </div>
                      <div className={classes['chip-tm']}>
                        {fileUploaded?.length ? (
                          <div className={classes['img-preview']}>
                            {fileUploaded.map((item: any) => {
                              return (
                                <>
                                  <img
                                    crossOrigin="anonymous"
                                    src={item}
                                    alt="Profile Pic"
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
                        ) : editUserPopup && rowData?.profilePic ? (
                          <div className={classes['img-preview']}>
                            <img
                              crossOrigin="anonymous"
                              src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.profilePic}`}
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
                        ) : (
                          // <div>
                          //   <Chip
                          //     label={rowData?.profilePic}
                          //     removable
                          //     onRemove={() => removeLogoFromRowData()}
                          //   />
                          // </div>
                          <>
                            <div className={classes['img-preview']}>
                              <img src={ImageUrl.AttachmentClip} alt="" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* attachment */}

              <div className={classes['submitBtnDiv']}>
                <ButtonComponent
                  label={editUserPopup ? 'Edit User' : 'Add user'}
                  icon="pi pi-check"
                  iconPos="right"
                  apihitting={loading}
                  submitEvent={
                    editUserPopup ? editUserSubmitHandler : addUserSubmitHandler
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default AggregatorManageUser
