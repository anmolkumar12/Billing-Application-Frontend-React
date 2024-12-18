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
import { FormComponent } from "../../components/ui/form/form";
import classes from "./Contract.module.scss";
import _ from "lodash";
import { FormType } from "../../schemas/FormField";
import { AuthService } from "../../services/auth-service/auth.service";

const Contract: React.FC = () => {
  const [contractMaster, setContractMaster] = useState<any>([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);

  const loggedInUserId = AuthService?.userInfo?.value?.userId;

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
      .deactivateContractMaster(patchData)
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
            data-pr-tooltip={rowData.companyName}
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
      label: "Website",
      fieldName: "Website",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.Website}
          >
            {rowData.Website}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "CINNO",
      fieldName: "CINNO",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.CINNO}
          >
            {rowData.CINNO}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "IECode",
      fieldName: "IECode",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.IECode}
          >
            {rowData.IECode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "PAN",
      fieldName: "PAN",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.PAN}
          >
            {rowData.PAN}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "GST",
      fieldName: "gst_number",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.gst_number}
          >
            {rowData.gst_number}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Address",
      fieldName: "address",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.address}
          >
            {rowData.address}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Email",
      fieldName: "Email",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.Email}
          >
            {rowData.Email}
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
            data-pr-tooltip={rowData.description}
          >
            {rowData.description}
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
    companyName: {
      inputType: "inputtext",
      label: "Company Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    Website: {
      inputType: "inputtext",
      label: "Website",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    CINNO: {
      inputType: "inputtext",
      label: "CINNO",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    IECode: {
      inputType: "inputtext",
      label: "IECode",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    PAN: {
      inputType: "inputtext",
      label: "PAN",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    gst_number: {
      inputType: "inputtext",
      label: "GST",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    address: {
      inputType: "inputtext",
      label: "Address",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    Email: {
      inputType: "inputtext",
      label: "Email",
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