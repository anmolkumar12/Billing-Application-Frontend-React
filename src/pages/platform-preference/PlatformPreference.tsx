/* eslint-disable react/no-unescaped-entities */
import _, { values } from 'lodash'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext'
import { ColorPicker } from 'primereact/colorpicker'
import React, { FormEvent, useEffect, useState } from 'react'
import './PlatformPreference.scss'
import classes from './PlatformPreference.module.scss'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { ImageUrl } from '../../utils/ImageUrl'
import { FILE_TYPES } from '../../enums/file-types.enum'
import { Chip } from 'primereact/chip'
import { InputNumber } from 'primereact/inputnumber'
import { Editor } from 'primereact/editor'
import { Password } from 'primereact/password'
import { RadioButton } from 'primereact/radiobutton'
import { PlatformPreferenceService } from '../../services/platform-preference-service/platform-preference-service'
import { CONSTANTS } from '../../constants/Constants'
import { ButtonComponent } from '../../components/ui/button/Button'
import { Dropdown } from 'primereact/dropdown'
import { AggregatorAnalyticsService } from '../../services/aggregator-analytics-service/aggregator-analytics.service'
import { MasterService } from '../../services/master-service/master.service'
import { HTTPService } from '../../services/http-service/http-service'
import { APIURLS } from '../../constants/ApiUrls'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { TokenService } from '../../services/token-service/token-service'
import { AuthService } from '../../services/auth-service/auth.service'
import ConfirmDialogue from '../../components/ui/confirm-dialogue/ConfirmDialogue'
import DataTableBasicDemo from '../../components/ui/table/Table'

const PlatformPreference: React.FC = () => {
  const platformPreferenceService = new PlatformPreferenceService()
  const [key, setKey] = useState('profile')
  const [switchValue, setSwitchValue] = useState(false)
  const [paymentToggle, setPaymentToggle] = useState(true)
  const [enableSMS, setEnableSMS] = useState(true)
  const [storefrontURL, setStorefrontURL] = useState(
    process.env.REACT_APP_API_BASEURL
  )
  const [rewardTitle, setRewardTitle] = useState('Vega HR Points')
  const [senderEmail, setSenderEmail] = useState('notification@vegahr.com')
  const [senderName, setSenderName] = useState('vegans day')
  const [balance, setBalance] = useState(1000)
  const [editorValue, setEditorValue] = useState<any>()
  const [color, setColor] = useState<any>('000000')
  const [clientId, setClientId] = useState('')
  const [walletGUIId, setWalletGUIId] = useState('')
  const [secretId, setSecretId] = useState('')
  const [callbackURL, setCallbackURL] = useState('')
  const [orderStatus, setOrderStatus] = useState('Delivared')
  const [webhookStatus, setWebhookStatus] = useState('Delivared')
  // const [updateOptionsObj, setupdateOptionsObj] = useState<updateOptionsObj[]>(
  //   []
  // )
  const [profileTabData, setProfileTabData] = useState<any>([])
  const [attachments, setAttachments]: any = useState([])
  // const [isFormValid, setIsFormValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fileUploaded, setFileUploaded] = useState<any>([])
  const [clientList, setClientList] = useState([])
  const [walletList, setWalletList] = useState([])
  const [selectedClient, setSelectedClient] = useState<any>()
  const [selectedWallet, setSelectedWallet] = useState<any>()
  const [toggleState, setToggleState] = useState(1)
  const [showActivateWallet, setShowActivateWallet] = useState(false)
  const [token, setToken] = useState<any>()
  const [generateTokenPopup, setGenerateTokenPopup] = useState(false)
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false)
  const [actionPopupToggle, setActionPopupToggle] = useState<any>({
    displayToggle: false,
  })
  const [deactivatePopupToggle, setDeactivatePopupToggle] = useState<any>({
    displayToggle: false,
  })
  const [activatedClientList, setActivatedClientList] = useState([])
  const [deactivatePopup, setDeactivatePopup] = useState(false)
  const [deactivateRowData, setDeactivateRowData] = useState<any>()

  useEffect(() => {
    getProfileTabData()
    // getClientList()
    // getWalletList()

    AuthService.clientList$.subscribe((value: any) => {
      setClientList(value)
    })
    AuthService.aaggregatorWalletList$.subscribe((value: any) => {
      setWalletList(value)
    })
  }, [])

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(`#${color}`)
    ToasterService.show(`Color #${color} Coppied Successfully !`, 'success')
  }

  const copyToClipboardClientGuiId = () => {
    // console.log('walletGUIId', walletGUIId)
    navigator.clipboard.writeText(walletGUIId)
    ToasterService.show(`Clinet Gui Id Coppied Successfully !`, 'success')
  }

  const copyToClipboardSecretId = () => {
    // console.log('walletGUIId', secretId)
    navigator.clipboard.writeText(secretId)
    ToasterService.show(`Secret Id Coppied Successfully !`, 'success')
  }

  const copyToClipboardClientId = () => {
    // console.log('walletGUIId', clientId)
    navigator.clipboard.writeText(clientId)
    ToasterService.show(`Client Id Coppied Successfully !`, 'success')
  }

  const copyToClipboardToken = () => {
    navigator.clipboard.writeText(
      `{"accessToken": ${token?.accessToken},"refreshToken": ${token?.refreshToken}}`
    )
    ToasterService.show(`Token Coppied Successfully !`, 'success')
  }

  const copyToClipboardAccessToken = () => {
    navigator.clipboard.writeText(token.accessToken)
    ToasterService.show(`Access Token Coppied Successfully !`, 'success')
  }

  // const selectAttachment = (files: any) => {
  //   setAttachments([])
  //   if (files && files[0]) {
  //     _.each(files, (eventList) => {
  //       const fileType = eventList.name
  //         .split('.')
  //         [eventList.name.split('.').length - 1].toLowerCase()
  //       if (
  //         fileType == FILE_TYPES.JPEG ||
  //         fileType == FILE_TYPES.JPG ||
  //         fileType == FILE_TYPES.PNG ||
  //         fileType == FILE_TYPES.SVG
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
  //         ToasterService.show(`Invalid file format!`, 'error')
  //         eventList = null
  //       }
  //     })
  //   }
  // }

  const selectAttachment = (event1: any, event: any) => {
    const newEvent: any = [],
      newEvent1: any = []
    Array.prototype.push.apply(newEvent, event)
    Array.prototype.push.apply(newEvent1, event1.target.files)

    if (event && event1) {
      const fileType = event[0].name.split('.')[
        // eslint-disable-next-line no-unexpected-multiline
        event[0].name.split('.').length - 1
      ].toLowerCase()
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

  const removeFileHandler = (action: string) => {
    // console.log(action, 'action')
    if (action == 'add') {
      setAttachments([])
      setFileUploaded([])
    } else {
      // profileTabData.companyLogo = null
      // setProfileTabData(profileTabData)
      setProfileTabData([])
    }
  }

  const getProfileTabData = () => {
    platformPreferenceService
      .profileTabData()
      .then((response: any) => {
        // console.log('profile tab data', response)
        // profileDetailsForm.name.value = response[0].name
        // profileDetailsForm.countryName.value = response[0].countryName
        // profileDetailsForm.cityName.value = response[0].cityName
        // profileDetailsForm.stateName.value = response[0].stateName
        // profileDetailsForm.companyPincode.value = response[0].companyPincode
        // profileDetailsForm.registeredIdNumber.value =
        //   response[0].registeredIdNumber
        // profileDetailsForm.phoneNumber.value = response[0].phoneNumber
        // profileDetailsForm.companyName.value = response[0].companyName
        // profileDetailsForm.email.value = response[0].email
        // profileDetailsForm.companyWebsite.value = response[0].companyWebsite
        // profileDetailsForm.companyAddress.value = response[0].companyAddress
        setProfileTabData(response[0])
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const addLogo = () => {
    const formData: any = new FormData()
    if (!attachments?.length) {
      return ToasterService.show('Please Upload Logo', CONSTANTS.ERROR)
    }
    if (attachments?.length) {
      formData.set('file', attachments[0])
    }
    setLoading(true)
    new PlatformPreferenceService()
      .addLogo(formData)
      .then((res: any) => {
        ToasterService.show(res?.message, CONSTANTS.SUCCESS)
        setLoading(false)
      })
      .catch((err: any) => {
        setLoading(false)
        ToasterService.show(CONSTANTS.ERROR)
      })
  }

  // const getClientList = () => {
  //   new MasterService()
  //     .clientList()
  //     .then((response: any) => {
  //       setClientList(response)
  //       // setSelectedClient(response[0].value)
  //       // console.log('testttt')
  //       // setTimeout(() => {
  //       //   fetchClientDetails()
  //       // }, 0)
  //     })
  //     .catch((error: any) => [ToasterService.show(error, CONSTANTS.ERROR)])
  // }

  // const getWalletList = () => {
  //   new MasterService()
  //     .aggregatorWalletList()
  //     .then((response: any) => {
  //       setWalletList(response)
  //       // setSelectedWallet(response[0].value)
  //       // console.log('testttt')
  //       // setTimeout(() => {
  //       //   fetchClientDetails()
  //       // }, 0)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const onClientChange = (e: any) => {
    // console.log('onclientchangesss', e.target.value)
    e?.target?.value && setSelectedClient(e?.target?.value)
    fetchClientDetails(e?.target?.value, selectedWallet)
  }

  const onWalletChange = (e: any) => {
    // console.log('onwalletchangesss', e.target.value)
    e?.target?.value && setSelectedWallet(e?.target?.value)
    fetchClientDetails(selectedClient, e?.target?.value)
  }

  const activateWalletAdd = (event?: any) => {
    event.preventDefault()
    const obj = {
      clientId: selectedClient,
      walletId: selectedWallet,
    }
    // console.log(event, 'submitttttttttt')
    new PlatformPreferenceService()
      .activateWallet(obj)
      .then((response: any) => {
        // console.log(response, 'ressssssss')
        if (response?.statusCode == HTTP_RESPONSE.REQUEST_SUCCESS) {
          setShowActivateWallet(false)
          fetchClientDetails()
          ToasterService.show(response?.message, CONSTANTS.SUCCESS)
        }
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const toggleTab = (index: number) => {
    setToggleState(index)
    if (index == 4) {
      getActivatedClientList()
    }
  }

  const fetchClientDetails = (clientId?: any, walletId?: any) => {
    // console.log('superrrrrr', selectedClient, selectedWallet)
    if (selectedClient && selectedClient) {
      // event && event.preventDefault()
      setLoading(true)
      const Obj = {
        clientId: clientId || selectedClient,
        walletId: walletId || selectedWallet,
      }
      new PlatformPreferenceService()
        .rewardApiClientData(Obj)
        .then((response: any) => {
          setLoading(false)
          setShowActivateWallet(false)
          // console.log('response Afridi', response?.data)
          setClientId(response?.data?.[0]?.clientId)
          setWalletGUIId(response?.data?.[0]?.walletGuid)
          setSecretId(response?.data?.[0]?.secretId)
          !response?.data?.length && setShowActivateWallet(true)
          if (response.state === HTTP_RESPONSE.SUCCESS) {
            ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          }
        })
        .catch((error: any) => {
          setLoading(false)
          ToasterService.show(error, CONSTANTS.ERROR)
        })
    }
  }

  const getGenerateToken = (event?: any) => {
    setGenerateTokenPopup(true)
    event.preventDefault()
    const Obj = {
      walletGuid: walletGUIId,
      clientId: clientId,
      secretId: secretId,
    }
    new PlatformPreferenceService()
      .generateToken(Obj)
      .then((response: any) => {
        setShowConfirmDialogue(false)
        setGenerateTokenPopup(true)
        const tokens: any = []
        // for (const key in response) {
        //   if (Object.prototype.hasOwnProperty.call(response, key)) {
        //     tokens.push(`${key + ': ' + response[key]}`)
        //   }
        // }
        // console.log()
        // setToken(tokens.toString())
        setToken(response)
        // console.log('response generate token', response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  const onPopUpClose = (e?: any) => {
    // e?.preventDefault()
    setActionPopupToggle({ displayToggle: false })
    setShowConfirmDialogue(false)
    // setGenerateTokenPopup(false)
  }
  const onTokenGenerateClick = (event?: any) => {
    event.preventDefault()
    // console.log('onTokenGenerateClick')
    setShowConfirmDialogue(true)
    setActionPopupToggle({
      displayToggle: true,
      title: '',
      message:
        'Old token becomes invalid on generation of new token. Are you sure?',
      rejectFunction: onPopUpClose,
      acceptFunction: getGenerateToken,
    })
  }

  const closeGenerateTokenPopup = () => {
    setGenerateTokenPopup(false)
  }

  const getActivatedClientList = () => {
    new PlatformPreferenceService()
      .activatedClientList()
      .then((res: any) => {
        console.log(res, 'jjjrrreeessss')
        setActivatedClientList(res)
      })
      .catch((err: any) => {
        ToasterService.show(err, CONSTANTS.ERROR)
      })
  }

  const activeBody = (rowData: any) => {
    return (
      <>
        {rowData?.isActive == 1 ? (
          <span className="spanStyle" style={{ color: '#0EB700' }}>
            Activated
          </span>
        ) : (
          <span className="spanStyle" style={{ color: '#FF0000' }}>
            Deactivated
          </span>
        )}
      </>
    )
  }

  const actionBody = (rowData: any) => {
    if (rowData?.isActive == 1) {
      return (
        <>
          <img
            className="actionPencilImg"
            src={ImageUrl.DeactivateIconImage}
            alt=""
            onClick={(event: any) => {
              setDeactivateRowData(rowData)
              showPermissionPopup(event)
            }}
          />
        </>
      )
    }
  }

  const permissionPopupClose = (e?: any) => {
    // e?.preventDefault()
    setDeactivatePopupToggle({ displayToggle: false })
    setDeactivatePopup(false)
    // setGenerateTokenPopup(false)
  }

  const showPermissionPopup = (event?: any) => {
    event.preventDefault()
    console.log('showPermissionPopup')
    setDeactivatePopup(true)
    setDeactivatePopupToggle({
      displayToggle: true,
      title: '',
      message: 'Are you sure you want to Deactivate the Client?',
      rejectFunction: permissionPopupClose,
      acceptFunction: OnActionClick,
    })
  }

  const OnActionClick = () => {
    setLoading(true)
    // const deactivateRowData = deactivateRowData
    console.log(deactivateRowData, 'deactivateRowData')
    deactivateRowData &&
      new PlatformPreferenceService()
        .deactivateClient(deactivateRowData?.clientId)
        .then((response: any) => {
          setLoading(true)
          console.log('response', response)
          permissionPopupClose()
          getActivatedClientList()
          ToasterService.show(response?.data?.message, CONSTANTS.SUCCESS)
          // showPermissionPopup()
        })
        .catch((err: any) => ToasterService.show(err, CONSTANTS.ERROR))
  }

  const activatedClientTableColumns = [
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
      label: 'Client Name',
      fieldName: 'clientName',
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Wallet Name',
      fieldName: 'name',
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Wallet Guid',
      fieldName: 'walletGuid',
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Client Id',
      fieldName: 'clientId',
      sort: true,
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Status',
      fieldName: 'isActive',
      sort: true,
      textAlign: 'left',
      filter: true,
      body: activeBody,
    },
    // {
    //   label: 'Updated By',
    //   fieldName: 'updatedByName',
    //   sort: true,
    //   textAlign: 'left',
    //   filter: true,
    // },
    // {
    //   label: 'Updated At',
    //   fieldName: 'updatedAt',
    //   sort: true,
    //   textAlign: 'left',
    //   filter: true,
    // },
  ]

  return (
    <>
      <div className={classes['aggregator-reports-table']}>
        <div className="tab-header">
          <ul>
            <li
              className={toggleState === 1 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(1)}
            >
              Profile
            </li>
            <li
              className={toggleState === 2 ? 'active-tab' : 'tab'}
              onClick={() => toggleTab(2)}
            >
              Storefront
            </li>
            <li
              className={toggleState === 3 ? 'active-tab' : 'tab'}
              onClick={() => {
                toggleTab(3)
                fetchClientDetails
              }}
            >
              Reward API
            </li>
            <li
              className={toggleState === 4 ? 'active-tab' : 'tab'}
              onClick={() => {
                toggleTab(4)
              }}
            >
              Activated Wallet
            </li>
          </ul>
        </div>

        <div className="tab-contents">
          <div className={toggleState === 1 ? 'active-content' : 'content'}>
            <div className="row m-0">
              <div className="col-lg-10 col-md-12 p-0">
                <div className={classes['profile-tab']}>
                  <h4>Profile Details</h4>
                  {/* <FormComponent
                    customClassName="boxFieldsss rwm profile-details-form"
                    form={_.cloneDeep(profileDetailsForm)}
                    formUpdateEvent={profileDetailsFormHandler}
                    isFormValidFlag={isFormValid}
                    updateOptions={updateOptionsObj}
                  ></FormComponent> */}
                  <div className="row m-0">
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Client Name</h6>
                        <p>{profileTabData?.name}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Company Name</h6>
                        <p>{profileTabData?.companyName}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Email Id</h6>
                        <p>{profileTabData?.email}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Mobile Number</h6>
                        <p>{profileTabData?.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Company Website</h6>
                        <p>{profileTabData?.companyWebsite}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Company Website</h6>
                        <p>{profileTabData?.companyAddress}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Company Country</h6>
                        <p>{profileTabData?.countryName}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Company State</h6>
                        <p>{profileTabData?.stateName}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Company City</h6>
                        <p>{profileTabData?.cityName}</p>
                      </div>
                    </div>
                    <div className="col-md-6 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>Company Pin</h6>
                        <p>{profileTabData?.companyPincode}</p>
                      </div>
                    </div>
                    <div className="col-md-12 p-0">
                      <div className={classes['profile-details-item']}>
                        <h6>
                          Registered ID number ( ID such as: TAZ ID, business
                          registration, DUNS number etc)
                        </h6>
                        <p>{profileTabData?.registeredIdNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="saveBtn-switchSection">
                  <div className="row m-0">
                    <div className="col-lg-9 col-md-9 p-0">
                      <div className="switchSection">
                        <h6>
                          Show overall balance to admins{' '}
                          <InputSwitch
                            checked={switchValue}
                            onChange={(e) => setSwitchValue(e.value)}
                          />
                        </h6>
                        <p>
                          Enabling will allow the admins to view the overall
                          balance in company wallet while rewarding
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 p-0 perfect-right-row">
                      <button className="saveBtn">Save</button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className={toggleState === 2 ? 'active-content' : 'content'}>
            <div className={classes['storefrontTab']}>
              <form>
                <div className="row m-0">
                  <div className="col-lg-6 col-md-6 p-0">
                    <div className="row m-0">
                      <div className="col-md-12 p-0">
                        <div
                          className={
                            classes['storefrontURL'] + ' ' + classes['formItem']
                          }
                        >
                          <h4>Storefront URL</h4>
                          <h6>
                            This is the URL for one-stop redemption store.The
                            URL link cannot be edited.
                          </h6>
                          <InputText
                            value={storefrontURL}
                            onChange={(e: any) =>
                              setStorefrontURL(e.target.value)
                            }
                            disabled
                          />
                          <p>
                            <a href={storefrontURL}>Visit Storefront</a>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-12 p-0">
                        <div
                          className={
                            classes['formItem'] + ' ' + classes['colorPicker']
                          }
                        >
                          <h4>Storefront Color Picker</h4>
                          <ColorPicker
                            value={color}
                            className={classes['color-picker-input']}
                            onChange={(e) => setColor(e.value)}
                          ></ColorPicker>
                          <div className={classes['color-valueDiv']}>
                            <div
                              className={classes['color-value']}
                              style={{ borderColor: `#${color}` }}
                              onClick={() => copyToClipboard(color)}
                            >
                              <span>#{color}</span>
                            </div>
                            <p>See Where It Appears</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 p-0">
                    <div
                      className={
                        classes['formItem'] + ' ' + classes['company-logo-sec']
                      }
                    >
                      <h4>Company Logo</h4>
                      <h6>
                        This logo will be displayed in the storefront website,
                        campaigns and in all emails to the rewardees.
                      </h6>
                      <h6>
                        Recommended size: 240px width * 80px height. File type:
                        JPEG or PNG with transparent background or SVG
                      </h6>
                      {/* attachment */}
                      <div className={classes['upload-wrapper']}>
                        <label>
                          Upload Logo{' '}
                          <span style={{ color: 'red', float: 'none' }}>*</span>
                        </label>
                        <div className="row mx-0 my-2">
                          <div className="col-md-12">
                            <div
                              className={
                                classes['upload-file-section'] + ' ' + 'd-flex'
                              }
                            >
                              <div
                                className={classes['fileUpload']}
                                style={{ width: '50%' }}
                              >
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
                                  Drag files here <span> or browse</span> <br />
                                  <u>
                                    Support 240px width * 80px height. File
                                    type: JPEG or PNG
                                  </u>
                                </p>
                              </div>
                              <div
                                className={classes['chip-tmPP']}
                                style={{ width: '50%' }}
                              >
                                {fileUploaded?.length ? (
                                  fileUploaded.map((item: any, index: any) => {
                                    return (
                                      <div
                                        className={classes['img-preview']}
                                        key={index}
                                      >
                                        <img
                                          crossOrigin="anonymous"
                                          src={item}
                                        />
                                        <div
                                          className={
                                            classes['close-img-preview']
                                          }
                                          onClick={() =>
                                            removeFileHandler('add')
                                          }
                                        >
                                          &times;
                                        </div>
                                      </div>
                                    )
                                  })
                                ) : profileTabData?.companyLogo ? (
                                  <>
                                    <div className={classes['img-preview']}>
                                      <img
                                        crossOrigin="anonymous"
                                        src={`${process.env.REACT_APP_API_BASEURL}/${profileTabData?.companyLogo}`}
                                        style={{
                                          verticalAlign: 'middle',
                                          paddingRight: '2px',
                                        }}
                                        width={150}
                                        alt="Brand Logo"
                                      />
                                      <div
                                        className={classes['close-img-preview']}
                                        onClick={() =>
                                          removeFileHandler('edit')
                                        }
                                      >
                                        &times;
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className={classes['img-preview']}>
                                    <img src={ImageUrl.AttachmentClip} alt="" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* attachment */}
                    </div>
                  </div>
                  {/* <div className="col-lg-12 col-md-12 p-0">
                    <div className="form-toggle-sec payment-method">
                      <div className="form-details payment-details">
                        <h4>Payment method</h4>
                        <h6>
                          Activating this allows your users to make purchases
                          with their credit debit cards, net banking and digital
                          wallets as well.
                        </h6>
                      </div>
                      <div className="form-toggle payment-toggle perfect-right-row">
                        <InputSwitch
                          checked={paymentToggle}
                          onChange={(e) => setPaymentToggle(e.value)}
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </form>
              <div
                className={
                  classes['reset-save-sec'] + ' ' + 'perfect-right-row'
                }
              >
                {/* <div className="reset-sec">Reset Chenages</div> */}
                <ButtonComponent
                  label="Submit"
                  icon="pi pi-check"
                  iconPos="right"
                  apihitting={loading}
                  submitEvent={addLogo}
                />
              </div>
            </div>
          </div>
          <div className={toggleState === 3 ? 'active-content' : 'content'}>
            <div className={classes['reward-apiTab']}>
              <form action="">
                <div className={classes['formItem']}>
                  <div className="row m-0">
                    <div className="col-lg-12 col-md-12 p-0">
                      <div className="row mx-0 my-1">
                        <div className="col-lg-5 col-md-5 p-2">
                          <label> Select Client</label>
                          <Dropdown
                            className="rewardApi-dropdown"
                            value={selectedClient}
                            options={clientList}
                            onChange={(event: any) => {
                              onClientChange(event)
                            }}
                            optionLabel=""
                            placeholder="Select Client"
                          />
                        </div>
                        <div className="col-lg-5 col-md-5 p-2">
                          <label> Select Wallet</label>
                          <Dropdown
                            className="rewardApi-dropdown"
                            value={selectedWallet}
                            options={walletList}
                            onChange={(event: any) => {
                              onWalletChange(event)
                            }}
                            optionLabel=""
                            placeholder="Select Wallet"
                          />
                        </div>
                        {/* <div className="col-lg-2 col-md-2 p-2 d-flex justify-content-end align-items-end">
                          <ButtonComponent
                            label="Fetch Details"
                            icon="pi pi-check"
                            iconPos="right"
                            apihitting={loading}
                            submitEvent={fetchClientDetails}
                          />
                        </div> */}
                        {clientId && (
                          <div className="col-lg-4 col-md-6 p-2">
                            <label>
                              {' '}
                              Client Id{' '}
                              <span
                                onClick={() => {
                                  copyToClipboardClientId()
                                }}
                              >
                                <i className="pi pi-copy"></i>
                              </span>{' '}
                            </label>
                            <InputText
                              value={clientId}
                              // onChange={(e: any) => setClientId(e.target.value)}
                              placeholder="Client Id"
                              disabled={true}
                            />
                          </div>
                        )}

                        {secretId && (
                          <div className="col-lg-4 col-md-6 p-2">
                            <label htmlFor="">
                              Secret Id
                              <span onClick={() => copyToClipboardSecretId()}>
                                <i className="pi pi-copy"></i>
                              </span>{' '}
                            </label>
                            <Password
                              value={secretId}
                              // onChange={(e: any) => setSecretId(e.target.value)}
                              placeholder="Set Your Secret Id"
                              disabled={true}
                              toggleMask
                            />
                          </div>
                        )}

                        {walletGUIId && (
                          <div className="col-lg-4 col-md-6 p-2">
                            <label htmlFor="">
                              Wallet GUID{' '}
                              <span
                                onClick={() => copyToClipboardClientGuiId()}
                              >
                                <i className="pi pi-copy"></i>
                              </span>{' '}
                            </label>
                            <InputText
                              value={walletGUIId}
                              // onChange={(e: any) =>
                              //   setWalletGUIId(e.target.value)
                              // }
                              placeholder="Client GUID"
                              disabled={true}
                            />
                          </div>
                        )}

                        {showActivateWallet ? (
                          <div
                            className={
                              classes['activate-wallet'] +
                              ' ' +
                              classes['reset-save-sec'] +
                              ' ' +
                              'col-lg-12 col-sm-12 perfect-center-column'
                            }
                          >
                            <h6 className="mb-1">
                              This wallet is not activated yet!{' '}
                              <span>Click Activate Wallet to Activate</span>
                            </h6>
                            <div className="">
                              <ButtonComponent
                                label="Activate Wallet"
                                icon="pi pi-check"
                                iconPos="right"
                                apihitting={loading}
                                submitEvent={activateWalletAdd}
                              />
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      {walletGUIId && secretId && clientId ? (
                        <>
                          <h4 className="mt-3">
                            Generate Access Token and Refresh Token
                          </h4>
                          {/* {token} */}
                          {/* <div className="row mx-0 my-3">
                            {token.accessToken && (
                              <div className="col-lg-4 col-md-6 p-2">
                                <label htmlFor="">
                                  Access Token{' '}
                                  <span
                                    onClick={() => copyToClipboardAccessToken()}
                                  >
                                    <i className="pi pi-copy"></i>
                                  </span>{' '}
                                </label>
                                <InputText
                                  value={token?.accessToken}
                                  placeholder="Access Token"
                                  disabled={true}
                                />
                              </div>
                            )}
                            {token.refreshToken && (
                              <div className="col-lg-4 col-md-6 p-2">
                                <label htmlFor="">
                                  Refresh Token{' '}
                                  <span
                                    onClick={() =>
                                      copyToClipboardRefreshToken()
                                    }
                                  >
                                    <i className="pi pi-copy"></i>
                                  </span>{' '}
                                </label>
                                <InputText
                                  value={token.refreshToken}
                                  placeholder="Refresh Token"
                                  disabled={true}
                                />
                              </div>
                            )}
                          </div> */}
                          <button
                            className={classes['formItem-btn']}
                            // onClick={(e: any) => getGenerateToken(e)}
                            onClick={(e: any) => onTokenGenerateClick(e)}
                          >
                            Generate Token
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
                {showConfirmDialogue ? (
                  <ConfirmDialogue
                    actionPopupToggle={actionPopupToggle}
                    onCloseFunction={onPopUpClose}
                  />
                ) : null}
                {/* <div className="formItem">
                  <div className="row m-0">
                    <div className="col-lg-12 p-0">
                      <h4>Webhooks</h4>
                      <h6>
                        Define your callback URL and the events that will
                        triggers it.
                      </h6>
                      <div className="row mx-0 mt-2 mb-3">
                        <div className="col-lg-5 p-0 col-md-7 col-sm-12">
                          <label htmlFor="">Callback URL</label>
                          <InputText
                            value={callbackURL}
                            onChange={(e: any) =>
                              setCallbackURL(e.target.value)
                            }
                            placeholder="https://"
                          />
                        </div>
                      </div>
                      <div className="row mx-0 mt-1 mb-4">
                        <h4 className="p-0">Order Status</h4>
                        <div className="order-status-div p-0">
                          <div className="field-radiobutton">
                            <RadioButton
                              inputId="option1"
                              name="status"
                              value="Delivared"
                              onChange={(e) => setOrderStatus(e.value)}
                              checked={orderStatus === 'Delivared'}
                            />
                            <label htmlFor="option1">Delivared</label>
                          </div>
                          <div className="field-radiobutton">
                            <RadioButton
                              inputId="option2"
                              name="status"
                              value="Cancelled"
                              onChange={(e) => setOrderStatus(e.value)}
                              checked={orderStatus === 'Cancelled'}
                            />
                            <label htmlFor="option2">Cancelled</label>
                          </div>
                        </div>
                      </div>

                      <div className="row mx-0 my-3">
                        <h4 className="p-0">Webhook Status</h4>
                        <div className="order-status-div p-0">
                          <div className="field-radiobutton">
                            <RadioButton
                              inputId="option3"
                              name="webhook"
                              value="Enabled"
                              onChange={(e) => setWebhookStatus(e.value)}
                              checked={webhookStatus === 'Enabled'}
                            />
                            <label htmlFor="option1">Enabled</label>
                          </div>

                          <div className="field-radiobutton">
                            <RadioButton
                              inputId="option4"
                              name="webhook"
                              value="Disabled"
                              onChange={(e) => setWebhookStatus(e.value)}
                              checked={webhookStatus === 'Disabled'}
                            />
                            <label htmlFor="option1">Disabled</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </form>
              {/* <div className="reset-save-sec perfect-right-row">
                <div className="reset-sec">Reset Chenages</div>
                <button className="saveBtn">SAVE</button>
              </div> */}
            </div>
          </div>

          <div className={toggleState === 4 ? 'active-content' : 'content'}>
            <DataTableBasicDemo
              // buttonArr={buttonsArr}
              data={activatedClientList}
              column={activatedClientTableColumns}
              showGridlines={true}
              resizableColumns={true}
              rows={20}
              paginator={true}
              sortable={true}
              headerRequired={true}
              downloadedfileName={'Payments'}
              scrollHeight={'calc(100vh - 65px)'}
            />

            {deactivatePopup ? (
              <ConfirmDialogue
                actionPopupToggle={deactivatePopupToggle}
                onCloseFunction={permissionPopupClose}
              />
            ) : null}
          </div>
        </div>
      </div>
      {generateTokenPopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header">
              <div
                className="popup-close"
                onClick={() => {
                  closeGenerateTokenPopup()
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">Token Details</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closeGenerateTokenPopup()
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content">
              <p style={{ wordBreak: 'break-all' }}>
                <span>"accessToken":</span>{' '}
                {'"' + `${token?.accessToken}` + '",'}
              </p>

              <p style={{ wordBreak: 'break-all' }}>
                {' '}
                <span>
                  <span>"refreshToken":</span>
                </span>{' '}
                {'"' + `${token?.refreshToken}` + '"'}
              </p>
            </div>
            <div className="popup-lower-btn">
              <button
                className={classes['formItem-btn']}
                onClick={() => copyToClipboardToken()}
              >
                Copy Tokens
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default PlatformPreference
