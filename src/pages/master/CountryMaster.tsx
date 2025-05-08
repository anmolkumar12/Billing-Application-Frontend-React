import React, { FormEvent, useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ui/button/Button";
import DataTableBasicDemo from "../../components/ui/table/Table";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";
import FormComponent from "../../components/ui/form/form";
import classes from "./Master.module.scss";
import { CountryMasterService } from "../../services/masters/country-master/country.service";
import Cookies from "universal-cookie";
import { Tooltip } from "primereact/tooltip";
import _ from "lodash";
import { ToasterService } from "../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../constants/Constants";
import { FormType } from "../../schemas/FormField";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";
import { Loader } from "../../components/ui/loader/Loader";
import moment from "moment";
import { ValidationRegex } from "../../constants/ValidationRegex";

const CountryMaster = () => {
  const CountryFormFields = {
    name: {
      inputType: "inputtext",
      label: "Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    code: {
      inputType: "inputtext",
      label: "Code",
      value: null,
      validation: {
        required: true,
        pattern:ValidationRegex.onlyCharacters.pattern,
        patternHint:ValidationRegex.onlyCharacters.patternHint
      },
      fieldWidth: "col-md-6",
    },
    language: {
      inputType: "inputtext",
      label: "Language",
      value: null,
      validation: {
        required: false,
  
      },
      fieldWidth: "col-md-6",
    },
    phoneCode: {
      inputType: "inputtext",
      label: "Phone Code",
      value: null,
      validation: {
        required: false,
        pattern:ValidationRegex.phoneCode.pattern,
        patternHint:ValidationRegex.phoneCode.patternHint
      },
      fieldWidth: "col-md-6",
    },
  };
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [isEditCountry, setIsEditCountry] = useState<boolean>(false);
  const [CountryForm, setCountryForm] = useState<any>(
    _.cloneDeep(CountryFormFields)
  );

  const [CountryAddressForm, setCountryAddressForm] = useState<any>({});
  const [CountryBankForm, setCountryBankForm] = useState<any>({});
  const [CountryCompanyForm, setCountryCompanyForm] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const countryService = new CountryMasterService();

  const CountryMasterColumns = [
    {
      label: "Action",
      fieldName: "action",
      textAlign: "left",
      frozen: true,
      sort: false,
      filter: false,
      body: (rowData: any) => (
        <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
          <span
            className="pi pi-pencil"
            style={{ cursor: "pointer" }}
            title="Update"
            onClick={() => onUpdate(rowData)}
          ></span>
          {/* <span
            className={`pi pi-${rowData.isactive ? "ban" : "check-circle"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isactive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span> */}
        </div>
      ),
    },
    {
      label: "Country",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.name}
          >
            {rowData.name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Country Code",
      fieldName: "code",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "code",
      changeFilter: true,
      placeholder: "Country Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.code}
          >
            {rowData.code}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Language",
      fieldName: "language",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "language",
      changeFilter: true,
      placeholder: "Language",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.language}
          >
            {rowData.language}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Phone Codes",
      fieldName: "phoneCode",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "phone_code",
      changeFilter: true,
      placeholder: "Phone Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.phone_code}
          >
            {rowData.phoneCode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Additional Bank Details",
      fieldName: "bankAccAdditionalFields",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "bankAccAdditionalFields",
      changeFilter: true,
      placeholder: "Additional Bank Details",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.currency}
          >
            {rowData.bankAccAdditionalFields}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Addition Addresss Details",
      fieldName: "addressAdditionalFields",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "addressAdditionalFields",
      changeFilter: true,
      placeholder: "Addition Addresss Details",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.currency}
          >
            {rowData.addressAdditionalFields}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Addition Company Details",
      fieldName: "companyAddtionalFields",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "companyAddtionalFields",
      changeFilter: true,
      placeholder: "Addition Company Details",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.currency}
          >
            {rowData.companyAddtionalFields}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Status",
      fieldName: "isActive",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span style={{ color: rowData?.isactive == 1 ? "green" : "red" }}>
            {rowData?.isactive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      label: "Updated By",
      fieldName: "updated_by",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "updated_by",
      changeFilter: true,
      placeholder: "Updated By",
      body: (rowData: any) => (
        <div>
          <span id={`descriptionTooltip-${rowData.id}`}>
            {rowData?.updated_by}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
    {
      label: "Updated At",
      fieldName: "updated_at",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "updated_at",
      changeFilter: true,
      placeholder: "Description",
      body: (rowData: any) => (
        <div>
          <span id={`descriptionTooltip-${rowData.id}`}>
             {rowData.updated_at}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getCountryMaster();
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getCountryMaster = async () => {
    setLoader(true);
    try {
      const response = await countryService.getCountryMaster();
      response?.countries?.forEach((el: any) => {
        el.updated_at = el?.updated_at ? moment(el?.updated_at).format("DD-MM-YYYY HH:mm:ss") : null
       })
      setCountryMaster(response?.countries);
      return response?.countries;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const countryFormHandler = async (form: FormType) => {
    setCountryForm(form);
  };

  const countryAddressFormHandler = async (form: FormType) => {
    setCountryAddressForm(form);
  };

  const countryBankFormHandler = async (form: FormType) => {
    setCountryBankForm(form);
  };

  const countryCompanyFormHandler = async (form: FormType) => {
    setCountryCompanyForm(form);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateCountryMaster(data);
    setFormPopup(true);
    setIsEditCountry(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateCountryMaster = (data: any) => {
    try {
      CountryFormFields.name.value = data?.name;
      CountryFormFields.code.value = data?.code;
      CountryFormFields.language.value = data?.language;
      CountryFormFields.phoneCode.value = data?.phoneCode;
      setCountryForm(_.cloneDeep(CountryFormFields));
      const addressDetails = JSON.parse(data?.addressAdditionalFields || "");
      const addressForm = Object.keys(addressDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: `Option ${index + 1}`,
            value: addressDetails[`key${index + 1}`],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      setCountryAddressForm(addressForm);
      const bankDetails = JSON.parse(data?.bankAccAdditionalFields || "");
      const bankForm = Object.keys(bankDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: `Option ${index + 1}`,
            value: bankDetails[`key${index + 1}`],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      setCountryBankForm(bankForm);
      const companyDetails = JSON.parse(data?.companyAddtionalFields || "");
      const companyForm = Object.keys(companyDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: `Option ${index + 1}`,
            value: companyDetails[`key${index + 1}`],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      console.log('companyform------>',companyForm);
      setCountryCompanyForm(companyForm);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCountryAddress = () => {
    const noOfFields = Object?.keys(CountryAddressForm)?.length;
    const updatedAddressForm: any = {
      ...CountryAddressForm,
      [noOfFields]: {
        inputType: "inputtext",
        label: `Option ${noOfFields + 1}`,
        value: null,
        validation: {
          required: false,
        },
        fieldWidth: "col-md-4",
      },
    };
    setCountryAddressForm(updatedAddressForm);
  };

  const handleCountryBank = () => {
    const noOfFields = Object?.keys(CountryBankForm)?.length;
    const updatedBankForm: any = {
      ...CountryBankForm,
      [noOfFields]: {
        inputType: "inputtext",
        label: `Option ${noOfFields + 1}`,
        value: null,
        validation: {
          required: false,
        },
        fieldWidth: "col-md-4",
      },
    };
    setCountryBankForm(updatedBankForm);
  };

  const handleCountryCompany = () => {
    const noOfFields = Object?.keys(CountryCompanyForm)?.length;
    const updatedCompanyForm: any = {
      ...CountryCompanyForm,
      [noOfFields]: {
        inputType: "inputtext",
        label: `Option ${noOfFields + 1}`,
        value: null,
        validation: {
          required: false,
        },
        fieldWidth: "col-md-4",
      },
    };
    setCountryCompanyForm(updatedCompanyForm);
  };

  const createNewCountry = (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true); 
    try{
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(CountryForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.value;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const addressData = Object.keys(CountryAddressForm)?.reduce(
        (acc: any, item: any, index: any) => {
          if (CountryAddressForm[index]?.value != null) {
            acc[`key${index + 1}`] = CountryAddressForm[index]?.value;
          }
          return acc;
        },
        {}
      );
      const bankData = Object.keys(CountryBankForm)?.reduce(
        (acc: any, item: any, index: any) => {
          if (CountryBankForm[index]?.value != null) {
            acc[`key${index + 1}`] = CountryBankForm[index]?.value;
          }
          return acc;
        },
        {}
      );
      const companyData = Object.keys(CountryCompanyForm)?.reduce(
        (acc: any, item: any, index: any) => {
          if (CountryCompanyForm[index]?.value != null) {
            acc[`key${index + 1}`] = CountryCompanyForm[index]?.value;
          }
          return acc;
        },
        {}
      );
      console.log('countrycode--->',CountryForm);
      const obj = {
        name: CountryForm?.name?.value,
        code: CountryForm?.code?.value,
        language: CountryForm?.language?.value,
        phoneCode: CountryForm?.phoneCode?.value,
        addressAdditionalFields: addressData,
        bankAccAdditionalFields: bankData,
        companyAddtionalFields: companyData,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        countryService
          .createCountryMaster(obj)
          .then((response: any) => {
            if (response?.statusCode === HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, countryId: stateData?.id };
        countryService
          .updateCountryMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      }
    } else {
      ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
    }
    }
    finally{
      setIsSubmitting(false); 
    }
  };

  const onDelete = (data: any) => {
    patchData = data;
    setActionPopupToggle({
      displayToggle: false,
      title: "Delete",
      message: `Are you sure you want to ${
        !(data?.isactive || data?.is_active || data?.isActive)
          ? "activate"
          : "deactivate"
      } this record?`,
      acceptFunction: confirmDelete,
      rejectFunction: onPopUpClose,
    });
    setShowConfirmDialogue(true);
  };

  const confirmDelete = () => {
    setLoader(true);
    countryService
      .deactivateCountryMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Country record ${
            patchData?.isactive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const closeFormPopup = () => {
    setFormPopup(false);
    setIsEditCountry(false);
    setStateData({});
    setCountryForm(_.cloneDeep(CountryFormFields));
    setCountryAddressForm({});
    setCountryBankForm({});
    setCountryCompanyForm({});
  };
  return loader ? (
      <Loader />
    ) : (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "0.5em",
        }}
      >
        <ButtonComponent
          label="Add New Country"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={countryMaster}
          column={CountryMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Country"}
        />
        {showConfirmDialogue ? (
          <ConfirmDialogue
            actionPopupToggle={actionPopupToggle}
            onCloseFunction={onPopUpClose}
          />
        ) : null}
      </p>
      {storeFormPopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header">
              <div
                className="popup-close"
                onClick={() => {
                  closeFormPopup();
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">{isEditCountry ? 'Update' : 'Add New'} Country</h4>
              </div>
              <div
                className="popup-right-close"
                onClick={() => {
                  closeFormPopup();
                }}
              >
                &times;
              </div>
            </div>
            <div className="popup-content" style={{ padding: "1rem 2rem" }}>
              <FormComponent
                form={_.cloneDeep(CountryForm)}
                formUpdateEvent={countryFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
              {/* attachment */}
              <div className={classes["upload-wrapper"]}>
                <div className="row">
                  <div
                    className={`col-md-12 ${classes["addition-field-header"]}`}
                  >
                    <h5 className="popup-heading">
                      Additional Address Details
                    </h5>
                    <div
                      className="popup-right-close"
                      onClick={() => {
                        handleCountryAddress();
                      }}
                    >
                      +
                    </div>
                  </div>
                  <div className="col-md-12">
                    {Object?.keys(CountryAddressForm)?.length > 0 && (
                      <FormComponent
                        form={_.cloneDeep(CountryAddressForm)}
                        formUpdateEvent={countryAddressFormHandler}
                        isFormValidFlag={isFormValid}
                      ></FormComponent>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`col-md-12 ${classes["addition-field-header"]}`}
                  >
                    <h5 className="popup-heading">Additional Bank Details</h5>
                    <div
                      className="popup-right-close"
                      onClick={() => {
                        handleCountryBank();
                      }}
                    >
                      +
                    </div>
                  </div>
                  <div className="col-md-12">
                    {Object?.keys(CountryBankForm)?.length > 0 && (
                      <FormComponent
                        form={_.cloneDeep(CountryBankForm)}
                        formUpdateEvent={countryBankFormHandler}
                        isFormValidFlag={isFormValid}
                      ></FormComponent>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div
                    className={`col-md-12 ${classes["addition-field-header"]}`}
                  >
                    <h5 className="popup-heading">Additional Company Details</h5>
                    <div
                      className="popup-right-close"
                      onClick={() => {
                        handleCountryCompany();
                      }}
                    >
                      +
                    </div>
                  </div>
                  <div className="col-md-12">
                    {Object?.keys(CountryCompanyForm)?.length > 0 && (
                      <FormComponent
                        form={_.cloneDeep(CountryCompanyForm)}
                        formUpdateEvent={countryCompanyFormHandler}
                        isFormValidFlag={isFormValid}
                      ></FormComponent>
                    )}
                  </div>
                </div>
              </div>
              {/* attachment */}
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                iconPos="right"
                submitEvent={createNewCountry}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CountryMaster;
