import _, { values } from 'lodash'
import { Chip } from 'primereact/chip'
import { Dropdown } from 'primereact/dropdown'
import React, { useEffect, useState } from 'react'
import { ButtonComponent } from '../../components/ui/button/Button'
import { FormComponent } from '../../components/ui/form/form'
import Label from '../../components/ui/label/Label'
import { CONSTANTS } from '../../constants/Constants'
import { FormType, updateOptionsObj } from '../../schemas/FormField'
import { MasterService } from '../../services/master-service/master.service'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { ImageUrl } from '../../utils/ImageUrl'
import './VegaPro.scss'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { InputText } from 'primereact/inputtext'
import { AuthService } from '../../services/auth-service/auth.service'

const VegaPro: React.FC = () => {
  const [key, setKey] = useState('sendToFew')
  const [isFormValid, setisFormValid] = useState(true)
  const [updateOptionsObj, setupdateOptionsObj] = useState<updateOptionsObj[]>(
    []
  )
  const [propertyAttachments, setpropertyAttachments]: any = useState([])
  const [allowedFormats, setallowedFormats] = useState(['xls', 'xlsx'])
  const [countryList, setCountryList] = useState()
  const [selectedCountry, setSelectedCountry] = useState()
  const [readOnly, setReadOnly] = useState(true)
  const [toggleState, setToggleState] = useState(1)
  const [brands, setBrands] = useState<any>()
  const [denominations, setDenominations] = useState<any>()

  useEffect(() => {
    // getCountryList()
    // getBrandsFilterList()
    // getDenominationList()

    AuthService.countryList$.subscribe((value: any) => {
      setCountryList(value)
    })
    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrands(value)
      vegaProForm.name.options = value
    })
    AuthService.denominationList$.subscribe((value: any) => {
      setDenominations(value)
      vegaProForm.denominationsId.options = value
    })
  }, [])

  // const getCountryList = () => {
  //   new MasterService()
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setCountryList(response?.country)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getBrandsFilterList = () => {
  //   new MasterService()
  //     .brandAndBrandCodeFilter()
  //     .then((response: any) => {
  //       setBrands(response?.brands)
  //       vegaProForm.name.options = response?.brands
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  // const getDenominationList = () => {
  //   new MasterService()
  //     .denominationList()
  //     .then((response: any) => {
  //       // console.log(response, 'resssssss')
  //       setDenominations(response)
  //       vegaProForm.denominationsId.options = response
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  const onFilesChange = (files: any) => {
    // console.log(files)
    setpropertyAttachments([])
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          allowedFormats.indexOf(
            eventList.name.split('.')[
              // eslint-disable-next-line no-unexpected-multiline
              eventList.name.split('.').length - 1
            ].toLowerCase()
          ) > -1
        ) {
          if (eventList.size > 10485760) {
            return ToasterService.show(
              'file size is too large, allowed maximum size is 10 MB.',
              'error'
            )
          } else {
            setpropertyAttachments((prevVals: any) => [...prevVals, eventList])
          }
        } else {
          ToasterService.show(
            `Invalid file format.The allowed file format are ${allowedFormats.toString()}`,
            'error'
          )
          eventList = null
        }
      })
    }
  }

  const removeFileHandler = (index: any) => {
    setpropertyAttachments([])
  }

  const onPaymentChange = (e: any) => {
    // console.log(e, 'jjjjjj')
  }

  const optionsList = [
    { label: '100', value: '100' },
    { label: '200', value: '200' },
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '2000', value: '2000' },
    { label: 'Others', value: 'Others' },
  ]

  const vegaProFormHandler = (form: FormType) => {
    setVegaProForm(form)
  }

  const vegaProFormObj = {
    code: {
      inputType: 'inputtext',
      label: 'Email ID',
      value: null,
      validation: {
        required: true,
        minlength: 1,
        maxlength: 100,
      },
      fieldWidth: 'col-md-4',
    },
    name: {
      inputType: 'singleSelect',
      label: 'Brand Name',
      value: null,
      validation: {
        required: true,
      },
      options: brands,
      fieldWidth: 'col-md-4',
    },
    denominationsId: {
      inputType: 'singleSelect',
      label: 'Denomination',
      value: null,
      validation: {
        required: true,
      },
      options: denominations,
      fieldWidth: 'col-md-4',
    },
    Quantity: {
      inputType: 'inputNumber',
      label: 'Quantity',
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: 'col-md-4',
    },
    minValue: {
      inputType: 'inputNumber',
      label: 'Phone Number',
      value: null,
      validation: {
        // required: true,
      },
      fieldWidth: 'col-md-4',
    },
    maxValue: {
      inputType: 'inputNumber',
      label: 'PO Number',
      value: null,
      validation: {
        // required: true,
      },
      fieldWidth: 'col-md-4',
    },
    domain: {
      inputType: 'inputtext',
      label: 'Message to Recipient (Max 600 Characters...)',
      value: null,
      fieldWidth: 'col-md-12',
      validation: {
        // required: true,
      },
    },
  }

  const [vegaProForm, setVegaProForm] = useState<any>(
    _.cloneDeep(vegaProFormObj)
  )

  const toggleTab = (index: number) => {
    setToggleState(index)
  }

  return (
    <>
      <div className="vegaPro-body">
        <Tabs
          activeKey={key}
          transition={true}
          onSelect={(k: any) => setKey(k)}
          className="mb-1"
        >
          <Tab eventKey="sendToFew" title="Send To Few">
            <div className="sendToFew-body">
              <div className="row m-0">
                <div className="col-lg-10 col-12 p-0">
                  <div className="brand-section box-header">
                    <h1>Generate Brand Vouchers </h1>
                    <span>
                      Generate and Send Brand Vouchers to Anyone,Anytime-Hassle
                      Free
                    </span>
                  </div>

                  {/* <Label label="Payment" /> */}
                  <div className="dropdown-brand mb-2">
                    <Dropdown
                      value={selectedCountry}
                      options={countryList}
                      onChange={(event) => {
                        onPaymentChange(event?.value)
                        setSelectedCountry(event?.value)
                      }}
                      placeholder="Select Countries"
                    />
                  </div>

                  <div className="add-recipient-card">
                    <h4>Add Recipient</h4>
                    <FormComponent
                      customClassName="boxFieldsss rwm addRecipientForm"
                      form={_.cloneDeep(vegaProForm)}
                      formUpdateEvent={vegaProFormHandler}
                      isFormValidFlag={isFormValid}
                      updateOptions={updateOptionsObj}
                    ></FormComponent>
                    <h6 className="add-recipient-text">
                      Add Another Recipient
                    </h6>
                  </div>

                  <div className="row mx-0 mt-3 mb-2">
                    <div className="col-md-12 p-0">
                      {/* <Label label="Payment" /> */}
                      <div className="dropdown-brand reward-delivary-dropdown">
                        <Dropdown
                          // value={selectedPayment}
                          options={optionsList}
                          onChange={(event) => {
                            onPaymentChange(event?.value)
                            // setselectedPayment(event?.value)
                          }}
                          placeholder="Reward Delivery"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grandTotal box-header my-3">
                    <h5>
                      Grand Total <span>1000209</span>{' '}
                    </h5>
                    <ButtonComponent
                      label="Submit"
                      icon="pi pi-check"
                      iconPos="right"
                      submitEvent={console.log('Submitttttt')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="bulkUpload" title="Bulk Upload">
            <div className="bulkUpload-body">
              <div className="row m-0">
                <div className="col-lg-10 col-12 p-0">
                  <h5>Recipients</h5>
                  <div className="upload-inn-section">
                    <h6>Add your recipients in Bulk</h6>
                    <div className="fileUpload">
                      <span>
                        <img src={ImageUrl.FolderIconImage} />
                      </span>
                      <input
                        type="file"
                        onClick={(event: any) => {
                          event.target.value = null
                        }}
                        onChange={(e) => onFilesChange(e.target.files)}
                        className="upload"
                      />
                      <p>
                        <u>
                          Download the CSV/XLSX Template to get started with the
                          required format
                        </u>
                      </p>
                      <p>
                        <u>
                          {' '}
                          <i>View column definitions </i> for the CSV/XLSX files
                        </u>
                      </p>
                      <div className="chip-tm">
                        {propertyAttachments?.length
                          ? propertyAttachments.map((item: any, index: any) => {
                              return (
                                <Chip
                                  label={item?.name}
                                  removable
                                  onRemove={() => removeFileHandler(index)}
                                  key={index}
                                />
                              )
                            })
                          : null}
                      </div>
                    </div>
                  </div>

                  <div className="reward-delivary">
                    <div className="row m-0">
                      <div className="col-md-12 p-0">
                        <div className="reward-delivary-header">
                          <div className="box-header p-0">
                            <h4>Reward Delivery </h4>
                          </div>
                          <div className="row m-0">
                            <div className="col-md-12 col-12 p-0">
                              <p>Subject</p>
                              <InputText
                                id="subject"
                                name="subject"
                                placeholder="Enter your Subject"
                                value={'congrats'}
                                onChange={(e: any) => e.target.value}
                                readOnly={readOnly}
                                onFocus={() => setReadOnly(false)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12 p-0">
                        <div className="preview-section">
                          <h4>Preview</h4>
                          <ul>
                            <li
                              className={
                                toggleState === 1 ? 'active-tab' : 'tab'
                              }
                              onClick={() => toggleTab(1)}
                            >
                              <div className="preview">
                                {toggleState === 1 ? (
                                  <>
                                    <img
                                      src={ImageUrl.LaptopWhiteIcon}
                                      alt=""
                                    />
                                  </>
                                ) : (
                                  <>
                                    <img src={ImageUrl.LaptopIcon} alt="" />
                                  </>
                                )}
                                <span>Laptop</span>
                              </div>
                            </li>
                            <li
                              className={
                                toggleState === 2 ? 'active-tab' : 'tab'
                              }
                              onClick={() => toggleTab(2)}
                            >
                              <div className="preview">
                                {toggleState === 2 ? (
                                  <>
                                    <img
                                      src={ImageUrl.MobileWhiteIcon}
                                      alt=""
                                    />
                                  </>
                                ) : (
                                  <>
                                    <img src={ImageUrl.MobileIcon} alt="" />
                                  </>
                                )}

                                <span>Mobile</span>
                              </div>
                            </li>
                          </ul>

                          <div className="preview-body">
                            <div
                              className={
                                toggleState === 1 ? 'active-content' : 'content'
                              }
                            >
                              <div className="laptop-preview-body">
                                <div className="gift-preview-img">
                                  <img src={ImageUrl.GiftPreviewImg} alt="" />
                                </div>

                                <div className="gift-card">
                                  <div className="gift-card-brand">
                                    <img src={ImageUrl.AmazonDummy} alt="" />
                                  </div>
                                  <div className="gift-card-details">
                                    <h2>Amazon Pay e-Gift Card</h2>
                                    <h3>
                                      INR <span>234562.00</span>
                                    </h3>
                                    <p>Valid Till 07th July 2022</p>

                                    <div className="row mx-0 mt-3 mb-2">
                                      <div className="col-lg-4 col-md-6 col-6 p-0">
                                        <p>Gift Card Code</p>
                                        <h5>AMZER36DY23</h5>
                                      </div>
                                      <div className="col-lg-4 col-md-6 col-6 p-0">
                                        <p>Code Pin</p>
                                        <h5>AMZER36DY23</h5>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                toggleState === 2 ? 'active-content' : 'content'
                              }
                            >
                              <div className="mobile-preview-body">
                                <div className="gift-preview-img">
                                  <img src={ImageUrl.GiftPreviewImg} alt="" />
                                </div>

                                <div className="gift-card">
                                  <div className="gift-card-brand">
                                    <img src={ImageUrl.AmazonDummy} alt="" />
                                  </div>
                                  <div className="gift-card-details">
                                    <h2>Amazon Pay e-Gift Card</h2>
                                    <h3>
                                      INR <span>234562.00</span>
                                    </h3>
                                    <p>Valid Till 07th July 2022</p>

                                    <div className="row mx-0 mt-3 mb-2">
                                      <div className="col-lg-6 col-md-6 col-6 p-0">
                                        <p>Gift Card Code</p>
                                        <h5>AMZER36DY23</h5>
                                      </div>
                                      <div className="col-lg-6 col-md-6 col-6 p-0">
                                        <p>Code Pin</p>
                                        <h5>AMZER36DY23</h5>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  )
}
export default VegaPro
