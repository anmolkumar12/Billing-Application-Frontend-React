/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unexpected-multiline */
import React, { FormEvent, useEffect, useState } from "react";
import "primeicons/primeicons.css";
import { ContractMasterService } from "../../services/masters/contract-master/contract.service";

import { TabView, TabPanel } from "primereact/tabview";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";

import DataTableBasicDemo from "../../components/ui/table/Table";
import { Loader } from "../../components/ui/loader/Loader";
import { Tooltip } from "primereact/tooltip";
import { ToasterService } from "../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../constants/Constants";
import { ButtonComponent } from "../../components/ui/button/Button";
import FormComponent from "../../components/ui/form/form";
import classes from "./Contract.module.scss";
import _ from "lodash";
import { FormType } from "../../schemas/FormField";
import { AuthService } from "../../services/auth-service/auth.service";
import Cookies from "universal-cookie";

const Contract: React.FC = () => {
  const [contractMaster, setContractMaster] = useState<any>([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;

  let patchData: any;

  const contractService = new ContractMasterService();

  useEffect(() => {
      setFormPopup(false);
      getContractMaster();
    //       await getIndustryMaster();
    //       await getCountryMaster();
    //       await getStateMaster();
    //       await getAccountsMaster();
    //       await formatIndustry_ClientDetails();
    //       await formatCountry_ClientDetails();
    //       await formatState_ClientDetails();
    //       await formatAccount_ClientDetails();
    //       await formatCountry_Client_ShipDetails();
    //       await formatState_Client_ShipDetails();
  }, [contractMaster]);

//   const formatCompanyDetails = async () => {
//     const companyList = companyMaster.map(
//       (company: any) => company?.companyName
//     );
//     accountFieldsStructure.companyName.options = companyList;
//     await setAccountFieldsStructure(accountFieldsStructure);
//     await accountsFormHandler(accountFieldsStructure);
//   };

//   const formatIndustry_ClientDetails = async () => {
//     const industryList = industryMaster.map(
//       (industry: any) => industry?.industryName
//     );
//     clientFieldsStructure.industry_name.options = industryList;
//     await setClientFieldsStructure(clientFieldsStructure);
//     await clientFormHandler(clientFieldsStructure);
//   };

//   const formatCountry_ClientDetails = async () => {
//     const countrylist = countryMaster.map((country: any) => country?.name);
//     clientBillFieldsStructure.country_name.options = countrylist;
//     await setClientBillFieldsStructure(clientBillFieldsStructure);
//     await clientBillFormHandler(clientBillFieldsStructure);
//   };

//   const formatCountry_StateDetails = async () => {
//     const countrylist = countryMaster.map((country: any) => country?.name);
//     statesFieldsStructure.country_name.options = countrylist;
//     await setStatesFieldsStructure(statesFieldsStructure);
//     await statesFormHandler(statesFieldsStructure);
//   };

//   const formatState_ClientDetails = async () => {
//     console.log("stateMaster", stateMaster);
//     const statelist = stateMaster.map((state: any) => state.state_name);
//     console.log("state", statelist, clientBillFieldsStructure);
//     clientBillFieldsStructure.state_name.options = statelist;
//     await setClientBillFieldsStructure(clientBillFieldsStructure);
//     await clientBillFormHandler(clientBillFieldsStructure);
//   };

//   const formatAccount_ClientDetails = async () => {
//     const accountslist = accountsMaster.map(
//       (account: any) => account?.account_no
//     );
//     clientBillFieldsStructure.polestar_bank_account_number.options =
//       accountslist;
//     await setClientBillFieldsStructure(clientBillFieldsStructure);
//     await clientBillFormHandler(clientBillFieldsStructure);
//   };

//   const formatCountry_Client_ShipDetails = async () => {
//     const countrylist = countryMaster.map((country: any) => country?.name);
//     clientShipFieldsStructure.client_ship_to_country_name.options = countrylist;
//     await setClientShipFieldsStructure(clientShipFieldsStructure);
//     await clientShipFormHandler(clientShipFieldsStructure);
//   };

//   const formatState_Client_ShipDetails = async () => {
//     const statelist = stateMaster.map((state: any) => state?.state_name);
//     clientShipFieldsStructure.client_ship_to_state_name.options = statelist;
//     await setClientShipFieldsStructure(clientShipFieldsStructure);
//     await clientShipFormHandler(clientShipFieldsStructure);
//   };

  const getContractMaster = async () => {
    setLoader(true);
    try {
      const response = await contractService.getContractMaster();
      setContractMaster(response?.contracts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const deactivateContractMaster = () => {
    setLoader(true);
    contractService
      .deactivateContractMaster({...patchData, loggedInUserId})
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Contract deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getContractMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const openSaveForm = () => {
    setFormPopup(true);
  };

  const confirmDelete = () => {
    deactivateContractMaster();
  };

  const ContractTableColumns = [
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
            className={`pi pi-${rowData.isactive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isactive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Client",
      fieldName: "client",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.companyName}
          >
            {rowData.client}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Client Bill To",
      fieldName: "clientBillTo",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.Website}
          >
            {rowData.clientBillTo}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Client Shipping Address",
      fieldName: "clientShipAdd",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.CINNO}
          >
            {rowData.clientShipAdd}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Contact",
      fieldName: "contact",
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
            {rowData.contact}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Bill From",
      fieldName: "billFrom",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.PAN}
          >
            {rowData.billFrom}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Technology",
      fieldName: "technology",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.gst_number}
          >
            {rowData.technology}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Start Date",
      fieldName: "startDate",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.address}
          >
            {rowData.startDate}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "End Date",
      fieldName: "endDate",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.Email}
          >
            {rowData.endDate}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Name",
      fieldName: "name",
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
      label: "Code",
      fieldName: "code",
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
      label: "Tax Code",
      fieldName: "taxCode",
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
            {rowData.taxCode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Project Manager",
      fieldName: "projectManager",
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
            {rowData.projectManager}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Credit Period",
      fieldName: "creditPeriod",
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
            {rowData.creditPeriod}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Document Type",
      fieldName: "docType",
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
            {rowData.docType}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "PO Amount",
      fieldName: "poAmt",
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
            {rowData.poAmt}
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
      fieldName: "isactive",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span style={{ color: rowData?.isactive === 1 ? "green" : "red" }}>
            {rowData?.isactive === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const onDelete = (data: unknown) => {
    patchData = data;
    setActionPopupToggle({
      displayToggle: false,
      title: "Delete",
      message: `Are you sure you want to activate/deactivate this record`,
      acceptFunction: confirmDelete,
    });
    setShowConfirmDialogue(true);
  };

  const [stateData, setStateData] = useState<any>();

  const onUpdate = (data: any) => {
    setStateData(data);
    updateContractMaster(data);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const ContractFormFields = {
    client_name: {
      inputType: "singleSelect",
      label: "Client",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    client_bill_to: {
      inputType: "singleSelect",
      label: "Client Bill To",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    client_ship_address: {
      inputType: "singleSelect",
      label: "Client Shipping Address",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    client_contact: {
      inputType: "singleSelect",
      label: "Contact",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    bill_from: {
      inputType: "singleSelect",
      label: "Bill From",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    technology: {
      inputType: "singleSelect",
      label: "Technology",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    contract_type: {
      inputType: "singleSelect",
      label: "Contract Type",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    start_date: {
      inputType: "singleDatePicker",
      label: "Start Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    end_date: {
      inputType: "singleDatePicker",
      label: "End Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    name: {
      inputType: "inputtext",
      label: "Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    code: {
      inputType: "inputtext",
      label: "Code",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    tax_code: {
      inputType: "singleSelect",
      label: "Tax Code",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    project_manager: {
      inputType: "singleSelect",
      label: "Project Manager",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    credit_period: {
      inputType: "inputtext",
      label: "Credit Period (No. of Days)",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    doc_type: {
      inputType: "singleSelect",
      label: "Document Type",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    po_amt: {
      inputType: "inputtext",
      label: "PO Amount",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
  };

  const updateContractMaster = (data: any) => {
    try {
      // CompanyFormFields.companyName.value = data?.companyName;
      // CompanyFormFields.Website.value = data?.Website;
      // CompanyFormFields.CINNO.value = data?.CINNO;
      // CompanyFormFields.IECode.value = data?.IECode;
      // CompanyFormFields.PAN.value = data?.PAN;
      // CompanyFormFields.Email.value = data?.Email;
      // CompanyFormFields.description.value = data?.description != null ? data?.description : "";
      // CompanyFormFields.gst_number.value = data?.gst_number;
      // CompanyFormFields.address.value = data?.address;
      // setCompanyForm(_.cloneDeep(CompanyFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const [contractFieldsStructure, setContractFieldsStructure]: any =
    useState(ContractFormFields);

  const parseDateString = (dateString: any) => { 
    const [year, month, day] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  const [ContractForm, setContractForm] = useState<any>(
    _.cloneDeep(contractFieldsStructure)
  );

  const closeFormPopup = () => {
    setFormPopup(false);
    setContractForm(_.cloneDeep(contractFieldsStructure));
  };

  const contractFormHandler = async (form: FormType) => {
    setContractForm(form);
  };

  const createNewContract = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ContractForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    // if (companyValidityFlag) {
    //   const formData: any = new FormData();

    //   const obj = {
    //     companyName: CompanyForm?.companyName?.value,
    //     Website: CompanyForm?.Website?.value,
    //     CINNO: CompanyForm?.CINNO?.value,
    //     IECode: CompanyForm?.IECode?.value,
    //     PAN: CompanyForm?.PAN?.value,
    //     Email: CompanyForm?.Email?.value,
    //     description: CompanyForm?.description?.value,
    //     gst_number: CompanyForm?.gst_number?.value,
    //     address: CompanyForm?.address?.value,
    //     isactive: 1,
    //     updatedBy: loggedInUserId,
    //   };

    //   Object.entries(obj).forEach(([key, value]: any) => {
    //     formData.set(key, value);
    //   });

    //   if (attachments?.length) {
    //     formData.set("file", attachments[0]);
    //   }

    //   if (!stateData?.id) {
    //     companyService
    //       .createCompanyMaster(formData)
    //       .then((response: any) => {
    //         if (response?.statusCode === HTTP_RESPONSE.CREATED) {
    //           setStateData({});
    //           closeFormPopup();
    //           getCompanyMaster();
    //           ToasterService.show(response?.message, CONSTANTS.SUCCESS);
    //         }
    //       })
    //       .catch((error: any) => {
    //         setStateData({});
    //         ToasterService.show(error, CONSTANTS.ERROR);
    //       });
    //   } else {
    //     const formData: any = new FormData();
    //     const updatePayload = { ...obj, companyId: stateData?.id };

    //     Object.entries(updatePayload).forEach(([key, value]: any) => {
    //       formData.set(key, value);
    //     });

    //     if (attachments?.length) {
    //       formData.set("file", attachments[0]);
    //     }

    //     companyService
    //       .updateCompanyMaster(formData)
    //       .then((response: any) => {
    //         if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
    //           setStateData({});
    //           closeFormPopup();
    //           getCompanyMaster();
    //           ToasterService.show(response?.message, CONSTANTS.SUCCESS);
    //         }
    //       })
    //       .catch((error: any) => {
    //         setStateData({});
    //         ToasterService.show(error, CONSTANTS.ERROR);
    //       });
    //   }
    // } else {
    //   ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
    // }
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
            label="Add New Contract"
            icon="pi pi-check"
            iconPos="right"
            submitEvent={openSaveForm}
        />
        </div>
        <p className="m-0">
        <DataTableBasicDemo
            data={contractMaster}
            column={ContractTableColumns}
            showGridlines={true}
            resizableColumns={true}
            rows={20}
            paginator={true}
            sortable={true}
            headerRequired={true}
            scrollHeight={"calc(100vh - 80px)"}
            downloadedfileName={"Brandwise_Denomination_table"}
        />
        {showConfirmDialogue ? (
            <ConfirmDialogue
            actionPopupToggle={actionPopupToggle}
            onCloseFunction={onPopUpClose}
            loading={false}
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
                <h4 className="popup-heading">Add New Contract</h4>
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
                form={_.cloneDeep(ContractForm)}
                formUpdateEvent={contractFormHandler}
                isFormValidFlag={isFormValid}
                ></FormComponent>
            </div>

            <div className="popup-lower-btn">
                <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewContract}
                />
            </div>
            </div>
        </div>
        ) : null}
    </>
  );
};

export default Contract;