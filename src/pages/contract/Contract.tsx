/* eslint-disable no-unexpected-multiline */
import React, { FormEvent, useEffect, useState } from "react";
import "primeicons/primeicons.css";
// import { CompanyMasterService } from "../../services/masters/company-master/company.service";

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
import _, { unset } from "lodash";
import { FormType } from "../../schemas/FormField";
import { AuthService } from "../../services/auth-service/auth.service";
import { FILE_TYPES } from "../../enums/file-types.enum";
import { ImageUrl } from "../../utils/ImageUrl";
import { Chip } from "primereact/chip";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";

const Contract: React.FC = () => {
//   const [clientMaster, setClientMaster] = useState<any>([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeClientIndex, setActiveClientIndex] = useState(0);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [openClientForm, setOpenClientForm] = useState(false);
  const [attachments, setAttachments]: any = useState([]);

  const loggedInUserId = AuthService?.userInfo?.value?.userId;

  let patchData: any;

//   const clientService = new ClientMasterService();

  useEffect(() => {
    const fetchData = async () => {
      setFormPopup(false);
    //   switch (activeIndex) {
    //     case 0:
    //       await getCompanyMaster();
    //       break;
    //     case 1:
    //       await getCurrencyMaster();
    //       break;
    //     case 2:
    //       await getAccountsMaster();
    //       await getCompanyMaster();
    //       await formatCompanyDetails();
    //       break;
    //     case 3:
    //       await getIndustryMaster();
    //       break;
    //     case 4:
    //       await getProductMaster();
    //       break;
    //     case 5:
    //       await getProjectMaster();
    //       break;
    //     case 6:
    //       await getTaxMaster();
    //       break;
    //     case 7:
    //       await getCountryMaster();
    //       break;
    //     case 8:
    //       await getStateMaster();
    //       await getCountryMaster();
    //       await formatCountry_StateDetails();
    //       break;
    //     case 9:
    //       setOpenClientForm(false);
    //       setActiveClientIndex(0);
    //       await getClientMaster();
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
    //       break;
    //     default:
    //       break;
    //   }
    };
  }, [activeIndex]);

  const onTabChange = (e: any) => {
    setActiveIndex(e.index);
  };

  const onClientTabChange = (e: any) => {
    setActiveClientIndex(e.index);
  };

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

//   const getCompanyMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await companyService.getCompanyMaster();
//       setCompanyMaster(response?.companies);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getCurrencyMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await currencyService.getCurrencyMaster();
//       setCurrencyMaster(response?.currencies);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getIndustryMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await industryService.getIndustryMaster();
//       setIndustryMaster(response?.industries);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getAccountsMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await accountsService.getAccountsMaster();
//       setAccountsMaster(response?.accounts);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getProductMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await productService.getProductMaster();
//       setProductsMaster(response?.products);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getProjectMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await projectService.getProjectMaster();
//       setProjectsMaster(response?.projects);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getTaxMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await taxService.getTaxMaster();
//       setTaxMaster(response?.taxes);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getCountryMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await countryService.getCountryMaster();
//       setCountryMaster(response?.countries);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getStateMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await stateService.getStateMaster();
//       setStateMaster(response?.states);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const getClientMaster = async () => {
//     setLoader(true);
//     try {
//       const response = await clientService.getClientMaster();
//       setClientMaster(response?.clients);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   const deactivateCompanyMaster = () => {
//     setLoader(true);
//     companyService
//       .deactivateCompanyMaster(patchData)
//       .then(() => {
//         setLoader(false);
//         setShowConfirmDialogue(false);
//         ToasterService.show(
//           "Company record deactivated successfully",
//           CONSTANTS.SUCCESS
//         );
//         getCompanyMaster();
//       })
//       .catch((error) => {
//         setLoader(false);
//         return false;
//       });
//   };

  const openSaveForm = () => {
    setFormPopup(true);
  };

  const confirmDelete = () => {
    // add deactivate function
  };

//   const CompanyTableColumns = [
//     {
//       label: "Action",
//       fieldName: "action",
//       textAlign: "left",
//       frozen: false,
//       sort: false,
//       filter: false,
//       body: (rowData: any) => (
//         <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
//           <span
//             className="pi pi-pencil"
//             style={{ cursor: "pointer" }}
//             title="Update"
//             onClick={() => onUpdate(rowData)}
//           ></span>
//           <span
//             className={`pi pi-${rowData.isactive ? "check-circle" : "ban"}`}
//             style={{ cursor: "pointer" }}
//             title={rowData.isactive ? "Deactivate" : "Activate"}
//             onClick={() => onDelete(rowData)}
//           ></span>
//         </div>
//       ),
//     },
//     {
//       label: "Company",
//       fieldName: "companyName",
//       textAlign: "left",
//       sort: true,
//       filter: true,
//       fieldValue: "companyName",
//       changeFilter: true,
//       placeholder: "Name",
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.companyName}
//           >
//             {rowData.companyName}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "Website",
//       fieldName: "Website",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.Website}
//           >
//             {rowData.Website}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "CINNO",
//       fieldName: "CINNO",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.CINNO}
//           >
//             {rowData.CINNO}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "IECode",
//       fieldName: "IECode",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.IECode}
//           >
//             {rowData.IECode}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "PAN",
//       fieldName: "PAN",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.PAN}
//           >
//             {rowData.PAN}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "GST",
//       fieldName: "gst_number",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.gst_number}
//           >
//             {rowData.gst_number}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "Address",
//       fieldName: "address",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.address}
//           >
//             {rowData.address}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "Email",
//       fieldName: "Email",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.Email}
//           >
//             {rowData.Email}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "Description",
//       fieldName: "description",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span
//             id={`companyNameTooltip-${rowData.id}`}
//             data-pr-tooltip={rowData.description}
//           >
//             {rowData.description}
//           </span>
//           <Tooltip
//             target={`#companyNameTooltip-${rowData.id}`}
//             position="top"
//           />
//         </div>
//       ),
//     },
//     {
//       label: "Status",
//       fieldName: "isactive",
//       textAlign: "left",
//       frozen: false,
//       sort: true,
//       filter: true,
//       body: (rowData: any) => (
//         <div>
//           <span style={{ color: rowData?.isactive == 1 ? "green" : "red" }}>
//             {rowData?.isactive == 1 ? "Active" : "Inactive"}
//           </span>
//         </div>
//       ),
//     },
//   ];

//   const onDelete = (data: unknown) => {
//     patchData = data;
//     setActionPopupToggle({
//       displayToggle: false,
//       title: "Delete",
//       message: `Are you sure you want to activate/deactivate this record`,
//       acceptFunction: confirmDelete,
//     });
//     setShowConfirmDialogue(true);
//   };

  const [stateData, setStateData] = useState<any>();

  const onUpdate = (data: any) => {
    setStateData(data);
    // add update function
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

//   const CompanyFormFields = {
//     companyName: {
//       inputType: "inputtext",
//       label: "Company Name",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     Website: {
//       inputType: "inputtext",
//       label: "Website",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     CINNO: {
//       inputType: "inputtext",
//       label: "CINNO",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     IECode: {
//       inputType: "inputtext",
//       label: "IECode",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     PAN: {
//       inputType: "inputtext",
//       label: "PAN",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     gst_number: {
//       inputType: "inputtext",
//       label: "GST",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     address: {
//       inputType: "inputtext",
//       label: "Address",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     Email: {
//       inputType: "inputtext",
//       label: "Email",
//       value: null,
//       validation: {
//         required: true,
//       },
//       fieldWidth: "col-md-6",
//     },
//     description: {
//       inputType: "inputtextarea",
//       label: "Description",
//       value: null,
//       validation: {
//         required: false,
//       },
//       fieldWidth: "col-md-12",
//       rows: 3,
//     },
//   };

//   const updateCompanyMaster = (data: any) => {
//     try {
//       CompanyFormFields.companyName.value = data?.companyName;
//       CompanyFormFields.Website.value = data?.Website;
//       CompanyFormFields.CINNO.value = data?.CINNO;
//       CompanyFormFields.IECode.value = data?.IECode;
//       CompanyFormFields.PAN.value = data?.PAN;
//       CompanyFormFields.Email.value = data?.Email;
//       CompanyFormFields.description.value = data?.description != null ? data?.description : "";
//       CompanyFormFields.gst_number.value = data?.gst_number;
//       CompanyFormFields.address.value = data?.address;
//       setCompanyForm(_.cloneDeep(CompanyFormFields));
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const [accountFieldsStructure, setAccountFieldsStructure]: any =
//     useState(AccountsFormFields);

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

//   const [ClientShipForm, setClientShipForm] = useState<any>(
//     _.cloneDeep(clientShipFieldsStructure)
//   );

  const closeFormPopup = () => {
    setFormPopup(false);
    setOpenClientForm(false);
    // setClientShipForm(_.cloneDeep(clientShipFieldsStructure));
    setAttachments([]);
  };

//   const clientContactFormHandler = async (form: FormType) => {
//     setClientContactForm(form);
//   };

//   const createNewCompany = (event: FormEvent) => {
//     event.preventDefault();
//     let companyValidityFlag = true;
//     const companyFormValid: boolean[] = [];

//     _.each(CompanyForm, (item: any) => {
//       if (item?.validation?.required) {
//         companyFormValid.push(item.valid);
//         companyValidityFlag = companyValidityFlag && item.valid;
//       }
//     });

//     setIsFormValid(companyValidityFlag);
//     console.log('data', companyValidityFlag, CompanyForm, stateData);

//     if (companyValidityFlag) {
//       const formData: any = new FormData();

//       const obj = {
//         companyName: CompanyForm?.companyName?.value,
//         Website: CompanyForm?.Website?.value,
//         CINNO: CompanyForm?.CINNO?.value,
//         IECode: CompanyForm?.IECode?.value,
//         PAN: CompanyForm?.PAN?.value,
//         Email: CompanyForm?.Email?.value,
//         description: CompanyForm?.description?.value,
//         gst_number: CompanyForm?.gst_number?.value,
//         address: CompanyForm?.address?.value,
//         isactive: 1,
//         updatedBy: loggedInUserId,
//       };

//       Object.entries(obj).forEach(([key, value]: any) => {
//         formData.set(key, value);
//       });

//       if (attachments?.length) {
//         formData.set("file", attachments[0]);
//       }

//       if (!stateData?.id) {
//         companyService
//           .createCompanyMaster(formData)
//           .then((response: any) => {
//             if (response?.statusCode === HTTP_RESPONSE.CREATED) {
//               setStateData({});
//               closeFormPopup();
//               getCompanyMaster();
//               ToasterService.show(response?.message, CONSTANTS.SUCCESS);
//             }
//           })
//           .catch((error: any) => {
//             setStateData({});
//             ToasterService.show(error, CONSTANTS.ERROR);
//           });
//       } else {
//         const formData: any = new FormData();
//         const updatePayload = { ...obj, companyId: stateData?.id };

//         Object.entries(updatePayload).forEach(([key, value]: any) => {
//           formData.set(key, value);
//         });

//         if (attachments?.length) {
//           formData.set("file", attachments[0]);
//         }

//         companyService
//           .updateCompanyMaster(formData)
//           .then((response: any) => {
//             if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
//               setStateData({});
//               closeFormPopup();
//               getCompanyMaster();
//               ToasterService.show(response?.message, CONSTANTS.SUCCESS);
//             }
//           })
//           .catch((error: any) => {
//             setStateData({});
//             ToasterService.show(error, CONSTANTS.ERROR);
//           });
//       }
//     } else {
//       ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
//     }
//   };

  return <></>;

//   return loader ? (
//     <Loader />
//   ) : (
//     <>
//         <div
//         style={{
//             display: "flex",
//             justifyContent: "end",
//             marginBottom: "0.5em",
//         }}
//         >
//         <ButtonComponent
//             label="Add New Company"
//             icon="pi pi-check"
//             iconPos="right"
//             submitEvent={openSaveForm}
//         />
//         </div>
//         <p className="m-0">
//         <DataTableBasicDemo
//             data={companyMaster}
//             column={CompanyTableColumns}
//             showGridlines={true}
//             resizableColumns={true}
//             rows={20}
//             paginator={true}
//             sortable={true}
//             headerRequired={true}
//             scrollHeight={"calc(100vh - 80px)"}
//             downloadedfileName={"Brandwise_Denomination_table"}
//         />
//         {showConfirmDialogue ? (
//             <ConfirmDialogue
//             actionPopupToggle={actionPopupToggle}
//             onCloseFunction={onPopUpClose}
//             loading={false}
//             />
//         ) : null}
//         </p>
//         {storeFormPopup ? (
//         <div className="popup-overlay md-popup-overlay">
//             <div className="popup-body md-popup-body stretchLeft">
//             <div className="popup-header">
//                 <div
//                 className="popup-close"
//                 onClick={() => {
//                     closeFormPopup();
//                 }}
//                 >
//                 <i className="pi pi-angle-left"></i>
//                 <h4 className="popup-heading">Add New Company</h4>
//                 </div>
//                 <div
//                 className="popup-right-close"
//                 onClick={() => {
//                     closeFormPopup();
//                 }}
//                 >
//                 &times;
//                 </div>
//             </div>
//             <div className="popup-content" style={{ padding: "1rem 2rem" }}>
//                 <FormComponent
//                 form={_.cloneDeep(CompanyForm)}
//                 formUpdateEvent={companyFormHandler}
//                 isFormValidFlag={isFormValid}
//                 ></FormComponent>
//                 {/* attachment */}
//                 <div className={classes["upload-wrapper"]}>
//                 <div className="row">
//                     <div className="col-md-12">
//                     <div className={classes["upload-file-section"]}>
//                         <div className={classes["upload-file"]}>
//                         {attachments.length > 0 ? (
//                             <div className={classes["image-preview"]}>
//                             <img
//                                 src={attachments[0].preview}
//                                 alt="Preview"
//                             />
//                             <div className={classes["chip-tm"]}>
//                                 {attachments.map(
//                                 (
//                                     item: { name: string | undefined },
//                                     index: React.Key | null | undefined
//                                 ) => (
//                                     <Chip
//                                     label={item.name}
//                                     removable
//                                     onRemove={() =>
//                                         removeFileHandler()
//                                     }
//                                     key={index}
//                                     />
//                                 )
//                                 )}
//                             </div>
//                             </div>
//                         ) : (
//                             <div>
//                             <input
//                                 type="file"
//                                 onClick={(event: any) => {
//                                 event.target.value = null;
//                                 }}
//                                 onChange={(e) =>
//                                 selectAttachment(e.target.files)
//                                 }
//                                 className={classes["upload"]}
//                                 style={{ width: "unset" }}
//                             />
//                             <img
//                                 src={ImageUrl.FolderIconImage}
//                                 alt="Folder Icon"
//                             />
//                             <p>
//                                 Drag files here <span> or browse</span> <br />
//                                 <u>Support PNG</u>
//                             </p>
//                             </div>
//                         )}
//                         </div>
//                     </div>
//                     </div>
//                 </div>
//                 </div>
//                 {/* attachment */}
//             </div>

//             <div className="popup-lower-btn">
//                 <ButtonComponent
//                 label="Submit"
//                 icon="pi pi-check"
//                 iconPos="right"
//                 submitEvent={createNewCompany}
//                 />
//             </div>
//             </div>
//         </div>
//         ) : null}
//     </>
//   );
};

export default Contract;