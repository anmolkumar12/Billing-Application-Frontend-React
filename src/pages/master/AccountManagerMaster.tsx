import React, { FormEvent, useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ui/button/Button";
import DataTableBasicDemo from "../../components/ui/table/Table";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";
import FormComponent from "../../components/ui/form/form";
import classes from "./Master.module.scss";
import Cookies from "universal-cookie";
import { Tooltip } from "primereact/tooltip";
import _ from "lodash";
import { ToasterService } from "../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../constants/Constants";
import { FormType } from "../../schemas/FormField";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";
import { Loader } from "../../components/ui/loader/Loader";
import { IndustryMasterService } from "../../services/masters/industry-master/industry.service";
import { AccountMasterService } from "../../services/masters/account-manager-master/accountManager.service";
import moment from "moment";
import { CompanyMasterService } from "../../services/masters/company-master/company.service";
import { ValidationRegex } from "../../constants/ValidationRegex";

const AccountManagerMaster = () => {
  const AccountFormFields = {
    name: {
      inputType: "inputtext",
      label: "Name",
      value: null,
      validation: {
        required: true,
        pattern: ValidationRegex.onlyCharacters.pattern,
        patternHint: ValidationRegex.onlyCharacters.patternHint
      },
      fieldWidth: "col-md-6",
    },
    code: {
      inputType: "inputtext",
      label: "Ecode",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    account_manager_email: {
      inputType: "inputtext",
      label: "Email",
      value: null,
      validation: {
        required: true,
        email: true
      },
      fieldWidth: "col-md-6",
    },
    companyName: {
      inputType: "singleSelect",
      label: "Company",
      disable: false,
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    industryHeadNames: {
      inputType: "multiSelect",
      label: "Industry Head",
      value: null,
      options: [],
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    from_date: {
      inputType: "singleDatePicker",
      label: "From Date",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    description: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
  };
  const [industryHeadMaster, setIndustryHeadMaster] = useState<any>([]);
  const [accountMaster, setAccountMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditAccManager, setIsEditAccManager] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isDeactivateFormValid, setIsDeactivateFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [accountFieldsStructure, setAccountFieldsStructure] = useState<any>(
    _.cloneDeep(AccountFormFields)
  );
  const [AccountForm, setAccountForm] = useState<any>(
    _.cloneDeep(accountFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const companyService = new CompanyMasterService();


  const [deactivatePopup, setDeactivatePopup] = useState(false);
  const [rowData, setRowData] = useState<any>(null);


  const deactivateFormObject: any = {
    deactivationDate: {
      inputType: "singleDatePicker",
      label: "Select Deactivation Date",
      value: null,
      min: new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate()),
      max: new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDate()),
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
  }

  const [deactForm, setDeactivateForm] = useState<any>(_.cloneDeep(deactivateFormObject));

  const onDeactivate = (rowData: any) => {
    console.log('here we are')
    setRowData(rowData);
    if (rowData.isActive == 1) {
      setDeactivatePopup(true);
    }
    else {
      onDelete(rowData);
    }

  }

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const industryService = new IndustryMasterService();
  const accountService = new AccountMasterService();

  const AccountMasterColumns = [
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
      label: "Account Manager Name",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Account Manager Name",
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
      label: "Account Manager Ecode",
      fieldName: "code",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "code",
      changeFilter: true,
      placeholder: "Account Manager Ecode",
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
      label: "Account Manager Email",
      fieldName: "account_manager_email",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "account_manager_email",
      changeFilter: true,
      placeholder: "Account Manager Email",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.code}
          >
            {rowData.account_manager_email}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
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
      placeholder: "Name",
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
      label: "Industry Head Names",
      fieldName: "industryHeadNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryHeadNames",
      changeFilter: true,
      placeholder: "Industry Head Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.industryHeadNames}
          >
            {rowData.industryHeadNames}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "description",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.description}
          >
            {rowData.description != null &&
              rowData.description != "null" &&
              rowData.description != ""
              ? rowData.description
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
      label: "From Date",
      fieldName: "fromDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "fromDate",
      changeFilter: true,
      placeholder: "From Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.fromDate}
          >
            {rowData.fromDate}
            {/* {moment(rowData.fromDate).format("YYYY-MM-DD")} */}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "To Date",
      fieldName: "deactivationDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "deactivationDate",
      changeFilter: true,
      placeholder: "To Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.fromDate}
          >
            {rowData.deactivationDate}

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
            {/* {moment(rowData.updated_at).format('YYYY-MM-DD HH:mm:ss')} */}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getAccountMaster();
      const industries = await getIndustryHeadMaster();
      await formatIndustryHeadDetails(industries);
      const companies = await getCompanyMaster();
      await formatCompanyDetails(companies);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }

  }, [storeFormPopup, showConfirmDialogue]);

  const getCompanyMaster = async () => {
    setLoader(true);
    try {
      const response = await companyService.getCompanyMaster();
      const temp = response?.companies?.filter((item: any) => item?.isactive || item?.isActive)
      setCompanyMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatCompanyDetails = async (companies: any = companyMaster) => {
    const companyList = companies.map((company: any) => company?.companyName);
    accountFieldsStructure.companyName.options = companyList;
  };

  const getAccountMaster = async () => {
    setLoader(true);
    try {
      const response = await accountService.getAccountMaster();
      // const temp = response?.accountManagers?.filter((item: any) => item?.isactive || item?.isActive)
      response?.accountManagers?.forEach((el: any) => {
        el.fromDate = el?.fromDate ? moment(el?.fromDate).format("DD-MM-YYYY") : null;
        el.deactivationDate = el?.deactivationDate ? moment(el?.deactivationDate).format("DD-MM-YYYY") : null
        el.updated_at = el?.updated_at ? moment(el?.updated_at).format("DD-MM-YYYY HH:mm:ss") : null
      })
      setAccountMaster(response?.accountManagers);
      return response?.accountManagers;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getIndustryHeadMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryHeadMaster();
      const temp = response?.industryHeads?.filter((item: any) => item?.isactive || item?.isActive)
      setIndustryHeadMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatIndustryHeadDetails = async (
    industries: any = industryHeadMaster
  ) => {
    const industryHeadList = industries.map(
      (industryHead: any) => industryHead?.industryHeadName
    );
    accountFieldsStructure.industryHeadNames.options = industryHeadList;
    setAccountFieldsStructure(accountFieldsStructure);
    await accountFormHandler(accountFieldsStructure);
  };

  const formatDate = (dateString: any) => {
    if(!dateString)return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // const parseDateString = (dateString: any) => {
  //   const [year, month, day] = dateString?.split("/")?.map(Number);
  //   return new Date(year, month - 1, day);
  // };.

  const parseDateString = (dateString: any) => {
    if (!dateString) return new Date();
    const date: any = new Date(dateString);
    if (isNaN(date)) return new Date();
    const year = date.getFullYear();
    const month: any = String(date.getMonth() + 1).padStart(2, "0");
    const day: any = String(date.getDate()).padStart(2, "0");
    return new Date(year, month - 1, day);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const accountFormHandler = async (form: FormType) => {
    setAccountForm(form);
  };
  const deactivationFormHandler = async (form: FormType) => {
    setDeactivateForm(form);
  }
  const submitDeactivateFormHandler = (event: FormEvent) => {
    event.preventDefault();
    let validity = true;
    const deactivateFolrmValidaity: boolean[] = [];
    console.log('jjjjjjjjjjjj', deactForm);

    _.each(deactForm, (item: any) => {
      if (item?.validation?.required) {
        deactivateFolrmValidaity.push(item.valid);
        validity = validity && item.valid;
      }
    });

    setIsDeactivateFormValid(validity);
    if (validity) {
      onDelete(rowData)
    }
  }

  const onUpdate = (data: any) => {
    setStateData(data);
    updateAccountMaster(data);
    setFormPopup(true);
    setIsEditAccManager(true);
  };

  const closeDeactivation = () => {
    setRowData(null)
    setDeactivatePopup(false);
    setIsDeactivateFormValid(true);
    setDeactivateForm(_.cloneDeep(deactivateFormObject));
  }

  const onPopUpClose = (e?: any) => {
    closeDeactivation()
    setShowConfirmDialogue(false);
  };

  const updateAccountMaster = (data: any) => {
    try {
      accountFieldsStructure.name.value = data?.name;
      accountFieldsStructure.code.value = data?.code;
      accountFieldsStructure.account_manager_email.value = data?.account_manager_email;
      accountFieldsStructure.industryHeadNames.value =
        data?.industryHeadNames?.split(",");
      accountFieldsStructure.description.value =
        data?.description != null && data?.description != "null"
          ? data?.description
          : "";
      accountFieldsStructure.from_date.value = parseDateString(data?.fromDate);
      // accountFieldsStructure.fromDate.value = parseDateString(data?.fromDate);
      accountFieldsStructure.companyName.value = data?.companyName;
      setAccountForm(_.cloneDeep(accountFieldsStructure));
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

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      let industryHeadIds = "";
      AccountForm?.industryHeadNames?.value?.forEach((item: any) => {
        const id =
          industryHeadMaster?.find(
            (industryHead: any) => industryHead?.industryHeadName == item
          )?.id ?? null;
        if (id != null) {
          industryHeadIds =
            industryHeadIds != "" ? industryHeadIds + "," + id : id;
        }
      });

      const companyId =
        companyMaster.find(
          (company: any) =>
            company.companyName === AccountForm.companyName.value
        )?.id ?? null;

      const obj = {
        name: AccountForm?.name?.value,
        code: AccountForm?.code?.value,
        account_manager_email: AccountForm?.account_manager_email.value,
        fromDate: formatDate(AccountForm?.from_date?.value),
        description: AccountForm?.description?.value,
        industryHeadIds: industryHeadIds,
        isActive: 1,
        updatedBy: loggedInUserId,
        companyId: companyId,
      };

      if (!stateData?.id) {
        accountService
          .createAccountMaster(obj)
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
        const updatePayload = { ...obj, accountManagerId: stateData?.id };
        accountService
          .updateAccountMaster(updatePayload)
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
      message: `Are you sure you want to ${!(data?.isactive || data?.is_active || data?.isActive)
        ? "activate"
        : "deactivate"
        } this record?`,
      acceptFunction: confirmDelete,
      rejectFunction: onPopUpClose,
      askForDeactivationDate: data?.isactive || data?.is_active || data?.isActive,
      minDate: data?.fromDate,
    });
    setShowConfirmDialogue(true);
  };

  const confirmDelete = (deactivationDate?: Date) => {
    setLoader(true);
    accountService
      // .deactivateAccountMaster({ ...patchData, loggedInUserId,deactivationDate:deactForm.deactivationDate.value })
      .deactivateAccountMaster({ ...patchData, loggedInUserId, deactivationDate: deactivationDate ? formatDate(deactivationDate) : null })
      .then((response) => {
        setLoader(false);
        setShowConfirmDialogue(false);
        if (response.statusCode === 200) {
          closeDeactivation();

          ToasterService.show(
            `Account Manager record ${patchData?.isActive ? "deactivated" : "activated"
            } successfully`,
            CONSTANTS.SUCCESS
          );
        }
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const closeFormPopup = () => {
    setFormPopup(false);
    setIsEditAccManager(false);
    setStateData({});
    setAccountFieldsStructure(_.cloneDeep(AccountFormFields));
    setAccountForm(_.cloneDeep(AccountFormFields));
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
          label="Add New Account Manager"
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
          downloadedfileName={"Account_Manager"}
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
                <h4 className="popup-heading">{isEditAccManager ? 'Update' : 'Add New'} Account Manager</h4>
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

      {/* {deactivatePopup ? (
      <div className="popup-overlay md-popup-overlay">
        <div style={{maxWidth:'360px'}} className="popup-body md-popup-body stretchLeft">
          <div className="popup-header">
            <div
              className="popup-close"
              onClick={() => {
   
                closeDeactivation()
              }}
            >
              <i className="pi pi-angle-left"></i>
              <h4 className="popup-heading">Deactivate Account Manager</h4>
            </div>
            <div
              className="popup-right-close"
              onClick={() => {
                closeDeactivation()
            
              }}
            >
              &times;
            </div>
          </div>
          <div className="popup-content"  style={{paddingBottom:'0rem',maxHeight:"calc(100vh - 535px)" }}>
            <FormComponent
              form={_.cloneDeep(deactForm)}
              formUpdateEvent={deactivationFormHandler}
              isFormValidFlag={isDeactivateFormValid}
            ></FormComponent>
          </div>

          <div className="popup-lower-btn">
            <ButtonComponent
              label="Submit"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={submitDeactivateFormHandler}
            />
          </div>
        </div>
      </div>
    ) : null} */}
    </>
  );
};

export default AccountManagerMaster;
