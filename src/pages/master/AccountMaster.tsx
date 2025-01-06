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
import { AccountTypeMasterService } from "../../services/masters/account-type-master/accountType.service";
import { AccountsMasterService } from "../../services/masters/accounts-master/accounts.service";
import { Loader } from "../../components/ui/loader/Loader";
import { CompanyMasterService } from "../../services/masters/company-master/company.service";

const AccountMaster = () => {
  const AccountFormFields = {
    companyName: {
      inputType: "singleSelect",
      label: "Company",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    country_name: {
      inputType: "singleSelect",
      label: "Country",
      options: [],
      value: null,
      disable: true,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    account_type: {
      inputType: "singleSelect",
      label: "Account Type",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    bank_name: {
      inputType: "inputtext",
      label: "Bank Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    bank_address: {
      inputType: "inputtext",
      label: "Bank Address",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    account_no: {
      inputType: "inputtext",
      label: "Account Number",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    isDefaultAccount: {
      inputType: "inputSwitch",
      label: "Is It Default Account",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
  };
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const [accountTypeMaster, setAccountTypeMaster] = useState<any>([]);
  const [accountMaster, setAccountMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [accountFieldsStructure, setAccountFieldsStructure]: any =
    useState(AccountFormFields);
  const [AccountForm, setAccountForm] = useState<any>(
    _.cloneDeep(accountFieldsStructure)
  );
  const [AdditionalDetailsForm, setAdditionalDetailsForm] = useState<any>({});

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const companyService = new CompanyMasterService();
  const countryService = new CountryMasterService();
  const accountTypeService = new AccountTypeMasterService();
  const accountService = new AccountsMasterService();

  const AccountMasterColumns = [
    {
      label: "Action",
      fieldName: "action",
      textAlign: "left",
      frozen: false,
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
          <span
            className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Company",
      fieldName: "companyName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "companyName",
      changeFilter: true,
      placeholder: "Company",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.companyName}
          >
            {rowData.companyName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Country",
      fieldName: "countryName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "countryName",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.countryName}
          >
            {rowData.countryName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Account Type",
      fieldName: "accountTypeName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "accountTypeName",
      changeFilter: true,
      placeholder: "Account Type",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.accountTypeName}
          >
            {rowData.accountTypeName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Bank",
      fieldName: "bankName",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.bankName}
          >
            {rowData.bankName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Bank Address",
      fieldName: "bankAddress",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.bankAddress}
          >
            {rowData.bankAddress}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Account Number",
      fieldName: "accountNumber",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.accountNumber}
          >
            {rowData.accountNumber}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Default Account",
      fieldName: "isDefaultAccount",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.IECode}
          >
            {rowData.isDefaultAccount == 1 ? "Yes" : "No"}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Additional Details",
      fieldName: "additionalFieldDetails",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.additionalFieldDetails}
          >
            {rowData.additionalFieldDetails != null &&
            JSON.stringify(rowData.additionalFieldDetails) != "null" &&
            JSON.stringify(rowData.additionalFieldDetails) != ""
              ? JSON.stringify(rowData.additionalFieldDetails)
              : "NA"}
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
          <span style={{ color: rowData?.isActive == 1 ? "green" : "red" }}>
            {rowData?.isActive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getAccountMaster();
      await getAccountTypeMaster();
      const companies = await getCompanyMaster();
      const countries = await getCountryMaster();
      await formatCompanyDetails(companies);
      await formatCountryDetails(countries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getAccountMaster = async () => {
    setLoader(true);
    try {
      const response = await accountService.getAccountsMaster();
      setAccountMaster(response?.companyAccounts);
      return response?.companyAccounts;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getCompanyMaster = async () => {
    setLoader(true);
    try {
      const response = await companyService.getCompanyMaster();
      setCompanyMaster(response?.companies);
      return response?.companies;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getAccountTypeMaster = async () => {
    setLoader(true);
    try {
      const response = await accountTypeService.getAccountTypeMaster();
      setAccountTypeMaster(response?.accountTypes);
      return response?.accountTypes;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getCountryMaster = async () => {
    setLoader(true);
    try {
      const response = await countryService.getCountryMaster();
      setCountryMaster(response?.countries);
      return response?.countries;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatCompanyDetails = async (companies: any = companyMaster) => {
    const companyList = companies.map((company: any) => company?.companyName);
    accountFieldsStructure.companyName.options = companyList;
    setAccountFieldsStructure(accountFieldsStructure);
  };

  const formatCountryDetails = async (countries: any = countryMaster) => {
    const countrylist = countries.map((country: any) => country?.name);
    accountFieldsStructure.country_name.options = countrylist;
    await setAccountFieldsStructure(accountFieldsStructure);
    await accountFormHandler(accountFieldsStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const accountFormHandler = async (form: FormType) => {
    // Clone the form to ensure immutability
    const updatedForm = _.cloneDeep(form);
  
    console.log("we are there", updatedForm);
  
    console.log(
      "Company Name --->",
      updatedForm?.companyName?.value,
      AccountForm?.companyName?.value
    );
  
    if (updatedForm?.companyName?.value !== AccountForm?.companyName?.value) {
      const selectedCompany = companyMaster?.find(
        (item: any) =>
          item?.companyName === updatedForm?.companyName?.value
      );
  
      const selectedCountry = countryMaster?.find(
        (item: any) => item?.name === selectedCompany?.countryName
      );
  
      if (selectedCountry) {
        updatedForm.country_name.value = selectedCompany?.countryName;
  
        const accountTypes = accountTypeMaster
          ?.filter(
            (type: any) => type?.countryName === selectedCompany?.countryName
          )
          ?.map((item: any) => item?.accountTypeName);
  
        updatedForm.account_type.options = accountTypes;
  
        const addressDetails = JSON.parse(
          selectedCountry?.bankAccAdditionalFields
        );
  
        const detailsForm = Object.keys(addressDetails)?.reduce(
          (acc: any, item: any, index: any) => {
            acc[index] = {
              inputType: "inputtext",
              label: addressDetails[item],
              value: null,
              validation: {
                required: true,
              },
              fieldWidth: "col-md-4",
            };
            return acc;
          },
          {}
        );
  
        setAdditionalDetailsForm(detailsForm);
      }
    }
  
    // Update the state with the cloned and modified form
    setAccountForm(updatedForm);
  };
  

  const additionalDetailsFormHandler = async (form: FormType) => {
    setAdditionalDetailsForm(form);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    const accountTypes = accountTypeMaster
      ?.filter((type: any) => type?.countryName == data?.countryName)
      ?.map((item: any) => item?.accountTypeName);
    updateStateMaster(data, accountTypes);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateStateMaster = (data: any, accountTypes: any) => {
    try {
      accountFieldsStructure.country_name.value = data?.countryName;
      accountFieldsStructure.companyName.value = data?.companyName;
      accountFieldsStructure.account_type.options = accountTypes;
      accountFieldsStructure.account_type.value = data?.accountTypeName;
      accountFieldsStructure.bank_name.value = data?.bankName;
      accountFieldsStructure.bank_address.value = data?.bankAddress;
      accountFieldsStructure.account_no.value = data?.accountNumber;
      accountFieldsStructure.isDefaultAccount.value = data?.isDefaultAccount == 1 ? true : false;
      setAccountForm(_.cloneDeep(accountFieldsStructure));
      const bankDetails = data?.additionalFieldDetails;
      const bankForm = Object.keys(bankDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: item,
            value: bankDetails[item],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      setAdditionalDetailsForm(bankForm);
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewAccount = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(AccountForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    if (AccountForm?.isDefaultAccount?.value == true) {
      let defaultAccountFlag = false;
      accountMaster
        ?.filter(
          (acc: any) => acc?.companyName == AccountForm.companyName.value && !stateData?.id
        )
        ?.forEach((item: any) => {
          defaultAccountFlag = defaultAccountFlag || item?.isDefaultAccount;
        });
      if (defaultAccountFlag) {
        ToasterService.show(
          "A Default account for this company is already present",
          CONSTANTS.ERROR
        );
        return;
      }
    }

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const countryId =
        countryMaster.find(
          (country: any) => country.name === AccountForm.country_name.value
        )?.id ?? null;

      const companyId =
        companyMaster.find(
          (company: any) =>
            company.companyName === AccountForm.companyName.value
        )?.id ?? null;

      const accountTypeId =
        accountTypeMaster.find(
          (type: any) => type.accountTypeName === AccountForm.account_type.value
        )?.id ?? null;

      const bankData = Object.keys(AdditionalDetailsForm)?.reduce(
        (acc: any, item: any, index: any) => {
          if (AdditionalDetailsForm[index]?.value != null) {
            acc[AdditionalDetailsForm[index]?.label] =
              AdditionalDetailsForm[index]?.value;
          }
          return acc;
        },
        {}
      );
      const obj = {
        countryId: countryId,
        companyId: companyId,
        bankAccountTypeId: accountTypeId,
        isDefaultAccount: AccountForm?.isDefaultAccount?.value == true ? 1 : 0,
        bankName: AccountForm?.bank_name?.value,
        bankAddress: AccountForm?.bank_address?.value,
        accountNumber: AccountForm?.account_no?.value,
        additionalFieldDetails: bankData,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        accountService
          .createAccountsMaster(obj)
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
        const updatePayload = { ...obj, accountId: stateData?.id };

        accountService
          .updateAccountsMaster(updatePayload)
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
    accountService
      .deactivateAccountsMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Account record ${
            patchData?.isActive ? "deactivated" : "activated"
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
    setStateData({});
    setAccountFieldsStructure(_.cloneDeep(AccountFormFields));
    setAccountForm(_.cloneDeep(AccountFormFields));
    setAdditionalDetailsForm({});
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
          label="Add New Account"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={accountMaster}
          column={AccountMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Brandwise_Denomination_table"}
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
                <h4 className="popup-heading">Add New Account</h4>
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
                form={_.cloneDeep(AccountForm)}
                formUpdateEvent={accountFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
              <FormComponent
                form={_.cloneDeep(AdditionalDetailsForm)}
                formUpdateEvent={additionalDetailsFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewAccount}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AccountMaster;
