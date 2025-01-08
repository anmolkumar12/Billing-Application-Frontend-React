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

const AccountManagerMaster = () => {
  const AccountFormFields = {
    name: {
      inputType: "inputtext",
      label: "Account Manager Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    code: {
      inputType: "inputtext",
      label: "Account Manager Ecode",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    account_manager_email: {
      inputType: "inputtext",
      label: "Account Manager Email",
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
        required: false,
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

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const industryService = new IndustryMasterService();
  const accountService = new AccountMasterService();

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
            {/* {rowData.fromDate} */}
            {moment(rowData.fromDate).format("YYYY-MM-DD")}
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
      const industries = await getIndustryHeadMaster();
      await formatIndustryHeadDetails(industries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getAccountMaster = async () => {
    setLoader(true);
    try {
      const response = await accountService.getAccountMaster();
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
      setIndustryHeadMaster(response?.industryHeads);
      return response?.industryHeads;
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
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const parseDateString = (dateString: any) => {
    const [year, month, day] = dateString?.split("/")?.map(Number);
    return new Date(year, month - 1, day);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const accountFormHandler = async (form: FormType) => {
    setAccountForm(form);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateAccountMaster(data);
    setFormPopup(true);
    setIsEditAccManager(true);
  };

  const onPopUpClose = (e?: any) => {
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

      const obj = {
        name: AccountForm?.name?.value,
        code: AccountForm?.code?.value,
        account_manager_email:AccountForm?.account_manager_email.value,
        fromDate: formatDate(AccountForm?.from_date?.value),
        description: AccountForm?.description?.value,
        industryHeadIds: industryHeadIds,
        isActive: 1,  
        updatedBy: loggedInUserId,
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
      .deactivateAccountMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Account Manager record ${
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
    </>
  );
};

export default AccountManagerMaster;
