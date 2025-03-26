/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unexpected-multiline */
import React, { FormEvent, useEffect, useState } from "react";
import "primeicons/primeicons.css";
import { ContractMasterService } from "../../services/masters/contract-master/contract.service";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";
import DataTableBasicDemo from "../../components/ui/table/Table";
import { Loader } from "../../components/ui/loader/Loader";
import { Tooltip } from "primereact/tooltip";
import { ToasterService } from "../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../constants/Constants";
import { ButtonComponent } from "../../components/ui/button/Button";
import FormComponent from "../../components/ui/form/form";
import _ from "lodash";
import { FormType } from "../../schemas/FormField";

import Cookies from "universal-cookie";
import { ClientMasterService } from "../../services/masters/client-master/client.service";
import { ImageUrl } from "../../utils/ImageUrl";
import classes from "../master/Master.module.scss";
import { FILE_TYPES } from "../../enums/file-types.enum";

import { PoContractService } from "../../services/po-contract/poContract.service";
import EditableTable from "./EditableTable";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";
import moment from "moment";

const Contract: React.FC = () => {


  const objForm: any = {
    client_name: {
      inputType: "singleSelect",
      label: "Client",
      options: [],
      value: null,
      validation: {
        required: true
      },
      fieldWidth: "col-md-4",
    },
    clientBillTo: {
      inputType: "multiSelect",
      label: "Client Bill To",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    clientShipAddress: {
      inputType: "multiSelect",
      label: "Client Shipping Address",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    clientContact: {
      inputType: "singleSelect",
      label: "Contact",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    // billFrom: {
    //   inputType: "singleSelect",
    //   label: "Bill From",
    //   options: [],
    //   value: null,
    //   validation: {
    //     required:false
    //   },
    //   fieldWidth: "col-md-4",
    // },
    companyName: {
      inputType: "inputtext",
      label: "Company Name",
      // options: [],
      value: null,

      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    companyLocation: {
      inputType: "singleSelect",
      label: "Company Location",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    po_name: {
      inputType: "inputtext",
      label: "P.O Name",
      value: null,
      validation: {
        required: true
      },
      fieldWidth: "col-md-4",
    },
    creditPeriod: {
      inputType: "inputNumber",
      label: "Credit Period (Days)",

      value: null,
      validation: {
        required: true
      },
      fieldWidth: "col-md-4",
    },
    poAmount: {
      inputType: "inputNumber",
      label: "Po Amount",
      // options: [],
      value: null,
      validation: {
        required: true
      },
      fieldWidth: "col-md-4",
    },
    dueAmount: {
      inputType: "inputNumber",
      label: "Pending Amount",
      // options: [],
      disable: true,
      value: null,
      validation: {
        required: true
      },
      fieldWidth: "col-md-4",
    },

    start_date: {
      inputType: "singleDatePicker",
      label: "PO Start Date",
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    end_date: {
      inputType: "singleDatePicker",
      label: "PO End Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    projectService: {
      inputType: "multiSelect",
      label: "Service Type",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    technolgyGroup: {
      inputType: "multiSelect",
      label: "Technology Group",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    technolgySubGroup: {
      inputType: "multiSelect",
      label: "Technology Sub Group",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    technolgy: {
      inputType: "multiSelect",
      label: "Technology",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    oem: {
      inputType: "multiSelect",
      label: "OEM",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    product: {
      inputType: "multiSelect",
      label: "Product",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    industryGroups: {
      inputType: "multiSelect",
      label: "Industry Groups",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    subIndustries: {
      inputType: "multiSelect",
      label: "Sub Industries",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    industryHead: {
      inputType: "multiSelect",
      label: "Industry Head",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    salesManager: {
      inputType: "multiSelect",
      label: "Sales Manager",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    accountManager: {
      inputType: "multiSelect",
      label: "Account Manager",
      options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },


    docType: {
      inputType: "singleSelect",
      label: "Document Type",
      options: ["PO", "SOW", "Email"],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },
    poNumber: {
      inputType: "inputtext",
      label: "PO Number",
      value: null,
      hideField: true,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    srNumber: {
      inputType: "inputtext",
      label: "Sr Number",
      value: null,
      hideField: true,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    noOfResources: {
      inputType: "inputtext",
      label: "No of Resources",
      // options: [],
      value: null,
      validation: {
        required: false
      },
      fieldWidth: "col-md-4",
    },

  };
  const [poContractsData, setPoContractData] = useState<any>([]);
  const [clientListNames, setClientListNames] = useState<any>([]);
  const [poContractConfData, setPoContractConfData] = useState<any>([]);
  const [poContractNames, setPoContractNames] = useState<any>({
    projectService_names: '',
    technolgyGroup_names: '',
    technolgySubGroup_names: '',
    technolgy_names: '',
    oem_names: '',
    product_names: '',
    industryGroups_names: '',
    subIndustries_names: '',
    industryHead_names: '',
    salesManager_names: '',
    accountManager_names: '',
    clientBillTo_names: '',
    clientShipAddress_names: '',
    clientContact_names: '',
    companyName: '',
    companyLocation_names: ''
  })
  const [poMastersConfigData, setPoMastersConfigData] = useState<any>({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [rowData, setRowData] = useState<any>(null);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [cascadingData, setCascadingData] = useState<any>({ groupIndustryData: [], industryData: [], industryHeadData: [], salesManagerData: [], accountManagerData: [] })
  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");
  const [logoUrl, setLogoUrl] = useState('');
  const [attachments, setAttachments]: any = useState([]);

  const loggedInUserId = userInfo?.userId;

  let patchData: any;

  const contractService = new ContractMasterService();
  const clientService = new ClientMasterService();

  const [objFormState, setobjFormState] = useState<any>(
    _.cloneDeep(objForm)
  );

  // Function to update the end_date min value dynamically
  useEffect(() => {
    console.log('start date changed', objFormState?.start_date?.value, objFormState?.end_date?.value);
    setobjFormState((prevForm: any) => ({
      ...prevForm,
      end_date: {
        ...prevForm.end_date,
        min: prevForm.start_date?.value || null, // Set min as start_date value
      },
    }));
  }, [objFormState?.start_date?.value]);

  useEffect(() => {

    getContractMaster();
    getPoContractConfiguration();
    getPOContractMasterConfigData();
    getPOContractMasterCascadingData()

  }, []);

  const poContractService = new PoContractService()


  const getContractMaster = async () => {
    setLoader(true);
    try {
      const response = await poContractService.getPoContractsData();

      setPoContractData(response?.poContracts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };


  // const getPoContractConfiguration = async () => {
  //   setLoader(true);
  //   try {
  //     const response = await poContractService.getPoContractConfiguration();
  //     setPoContractConfData(response?.data);
  //     setClientListNames(response?.data?.map((item: any) => {
  //       return item.client_name
  //       // return {
  //       //      label:item?.client_name,
  //       //      value:item?.id?.toString()
  //       // }
  //     }))
  //     return response?.data
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoader(false);
  //   }
  // };


  const getPoContractConfiguration = async () => {
    setLoader(true);
    try {
      const response = await poContractService.getPoContractConfiguration();

      if (!response || !response.data) {
        throw new Error("Invalid response from API");
      }

      const data = Array.isArray(response.data) ? response.data : [];

      console.log("Response Data:", data);

      // Ensure unique clients based on client_id
      const uniqueClients = Array.from(
        new Map(data.map((item: any) => [item.client_id, item])).values()
      );

      setPoContractConfData(uniqueClients);

      setClientListNames(
        uniqueClients.map((item: any) => item.client_name || "Unknown Client")
      );

      return uniqueClients;
    } catch (error) {
      console.error("Error fetching PO contract configuration:", error);

      // Set an empty array in case of an error to prevent React rendering issues
      setPoContractConfData([]);
      setClientListNames([]);
    } finally {
      setLoader(false);
    }
  };


  const getPOContractMasterConfigData = async () => {
    setLoader(true);
    try {
      const response = await poContractService.getPOContractMasterConfigData();
      setPoMastersConfigData(response?.data?.data);

      // setPoContractConfData(response?.data);
      // setClientListNames(response?.data?.map((item:any) => {
      //   return item.client_name 
      //   // return {
      //   //      label:item?.client_name,
      //   //      value:item?.id?.toString()
      //   // }
      // }))
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  const getPOContractMasterCascadingData = async () => {
    setLoader(true);
    try {
      const response = await poContractService.getPOContractMasterCascadingData();
      console.log('------>', response?.data?.data)
      setCascadingData(response?.data?.data);

      // setPoContractConfData(response?.data);
      // setClientListNames(response?.data?.map((item:any) => {
      //   return item.client_name 
      //   // return {
      //   //      label:item?.client_name,
      //   //      value:item?.id?.toString()
      //   // }
      // }))
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };


  const deactivateContractMaster = () => {
    console.log('patchData--->', patchData)
    setLoader(true);
    poContractService
      .activateDeactivatePoContract({ id: patchData.id, isActive: patchData.isActive ? 0 : 1, loggedInUserId: loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "PO (contract) deactivated successfully",
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
    setRowData(null);
    console.log('objFormState', objFormState, clientListNames);

    objFormState.client_name.options = clientListNames;
    objFormState.projectService.options = Array.isArray(poMastersConfigData?.projectService)
      ? poMastersConfigData?.projectService.map((item: any) => ({
        label: item?.name,
        value: item.id.toString(),
      }))
      : [];

    objFormState.technolgyGroup.options = Array.isArray(poMastersConfigData?.technolgyGroup)
      ? poMastersConfigData?.technolgyGroup.map((item: any) => ({
        label: item?.name,
        value: item.id.toString(),
      }))
      : [];



    objFormState.industryGroups.options = cascadingData.groupIndustryData.map((item: any) => ({
      label: item?.groupIndustryName,
      value: item.groupIndustryId.toString(),
    }))


    objFormState.oem.options = Array.isArray(poMastersConfigData?.oem)
      ? poMastersConfigData?.oem.map((item: any) => ({
        label: item?.oemName,
        value: item.id.toString(),
      }))
      : [];

    objFormState.product.options = Array.isArray(poMastersConfigData?.product)
      ? poMastersConfigData?.product.map((item: any) => ({
        label: item?.productName,
        value: item.id.toString(),
      }))
      : [];

    // setobjFormState(_.cloneDeep(objForm));
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Client Name",
      fieldName: "client_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_name",
      changeFilter: true,
      placeholder: "Client Name",
      body: (rowData: any) => <span>{rowData.client_name}</span>,
    },
    {
      label: "Bill To",
      fieldName: "clientBillTo",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.clientBillTo_names}</span>,
    },
    {
      label: "Shipping Address",
      fieldName: "clientShipAddress",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.clientShipAddress_names}</span>,
    },
    {
      label: "Contact",
      fieldName: "clientContact",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.clientContact_names}</span>,
    },
    // {
    //   label: "Bill From",
    //   fieldName: "billFrom",
    //   textAlign: "left",
    //   frozen: false,
    //   sort: true,
    //   filter: true,
    //   body: (rowData:any) => <span>{rowData.billFrom || "N/A"}</span>,
    // },
    {
      label: "Company Name",
      fieldName: "companyName",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.companyName}</span>,
    },
    {
      label: "Company Location",
      fieldName: "companyLocation",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.companyLocation_names}</span>,
    },
    {
      label: "P.O Name",
      fieldName: "po_name",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.po_name}</span>,
    },
    {
      label: "Credit Period",
      fieldName: "creditPeriod",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.creditPeriod} days</span>,
    },
    {
      label: "PO Amount",
      fieldName: "poAmount",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.poAmount}</span>,
    },
    {
      label: "Pending Amount",
      fieldName: "dueAmount",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.dueAmount}</span>,
    },
    {
      label: "Start Date",
      fieldName: "start_date",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.start_date != "null" ? moment(rowData.start_date).format('DD-MM-YYYY') : 'NA'}</span>,
    },
    {
      label: "End Date",
      fieldName: "end_date",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.end_date != "null" ? moment(rowData.end_date).format('DD-MM-YYYY') : 'NA'}</span>,
    },
    {
      label: "Project Service",
      fieldName: "projectService",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.projectService_names}</span>,
    },
    {
      label: "Technology Group",
      fieldName: "technolgyGroup",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.technolgyGroup_names}</span>,
    },
    {
      label: "Technology Sub-Group",
      fieldName: "technolgySubGroup",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.technolgySubGroup_names}</span>,
    },
    {
      label: "Technology",
      fieldName: "technolgy",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.technolgy_names}</span>,
    },
    {
      label: "OEM",
      fieldName: "oem",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.oem_names}</span>,
    },
    {
      label: "Product",
      fieldName: "product",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.product_names}</span>,
    },
    {
      label: "Industry Groups",
      fieldName: "industryGroups",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.industryGroups_names}</span>,
    },
    {
      label: "Sub-Industries",
      fieldName: "subIndustries",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.subIndustries_names}</span>,
    },
    {
      label: "Industry Head",
      fieldName: "industryHead",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.industryHead_names}</span>,
    },
    {
      label: "Sales Manager",
      fieldName: "salesManager",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.salesManager_names}</span>,
    },
    {
      label: "Account Manager",
      fieldName: "accountManager",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData?.masterNames?.accountManager_names}</span>,
    },
    {
      label: "PO Number",
      fieldName: "poNumber",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => <span>{rowData.poNumber}</span>,
    },
    {
      label: "Status",
      fieldName: "isActive",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <span style={{ color: rowData?.isActive ? "green" : "red" }}>
          {rowData?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      label: "Created At",
      fieldName: "created_at",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <span>
          {rowData.created_at ? moment(rowData.created_at).format('DD-MM-YYYY') : null}
        </span>
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




  const onUpdate = (data: any) => {
    console.log('rowData---->', data);
    setRowData(data)

    updatePoContactMasterData(data);
    // setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
    setobjFormState(_.cloneDeep(objForm));
  };



  const updatePoContactMasterData = (rowData: any) => {
    try {
      // objFormState.client_name.value = 
      objFormState.client_name.options = clientListNames;
      objFormState.client_name.value = rowData.client_name
      // if(currentForm.client_name.value !== objFormState.client_name.value){
      const configData = poContractConfData.find((item: any) => item.client_name == rowData?.client_name)
      if (configData) {
        objFormState.clientBillTo.options = configData.clientBill?.filter((item: any) => item.id).map((item: any, index: number) => {
          return {
            label: concatAddresses(item.address1, item.address2, item.address3),
            value: item.id.toString(),
            isDefault: index == 0 ? 1 : 0
          }
        })

        objFormState.clientBillTo.value = rowData?.clientBillTo ? rowData?.clientBillTo.split(",") : [];

        objFormState.clientShipAddress.options = configData.clientShip?.filter((item: any) => item.id).map((item: any, index: number) => {
          return {
            label: concatAddresses(item.address1, item.address2, item.address3),
            value: item.id.toString(),
            isDefault: index == 0 ? 1 : 0
          }
        })
        objFormState.clientShipAddress.value = rowData?.clientShipAddress ? rowData?.clientShipAddress.split(",") : [];

        objFormState.clientContact.options = Array.isArray(configData?.contacts) ? configData.contacts?.filter((item: any) => item.id).map((item: any, index: number) => {
          return {
            label: item.name,
            value: item.id.toString(),
            isDefault: index == 0 ? 1 : 0
          }
        }) : []

        objFormState.clientContact.value = rowData?.clientContact ? rowData?.clientContact : null;

        objFormState.companyName.value = configData?.companyInfo.companyName;
        objFormState.companyName.disable = false;


        objFormState.companyLocation.options = [{ label: concatAddresses(configData?.companyLocation?.address1, configData?.companyLocation?.address2, configData?.companyLocation?.address3) || "", value: configData?.companyLocation?.id.toString() }];
        objFormState.companyLocation.value = configData?.companyLocation?.id.toString()

      }
      // }

      console.log('rowDataaaaaa', rowData, objFormState);

      objFormState.projectService.options = Array.isArray(poMastersConfigData?.projectService)
        ? poMastersConfigData?.projectService.map((item: any) => ({
          label: item?.name,
          value: item.id.toString(),
        }))
        : [];

      objFormState.technolgyGroup.options = Array.isArray(poMastersConfigData?.technolgyGroup)
        ? poMastersConfigData?.technolgyGroup.map((item: any) => ({
          label: item?.name,
          value: item.id.toString(),
        }))
        : [];



      objFormState.industryGroups.options = cascadingData.groupIndustryData.map((item: any) => ({
        label: item?.groupIndustryName,
        value: item.groupIndustryId.toString(),
      }))


      objFormState.oem.options = Array.isArray(poMastersConfigData?.oem)
        ? poMastersConfigData?.oem.map((item: any) => ({
          label: item?.oemName,
          value: item.id.toString(),
        }))
        : [];

      objFormState.product.options = Array.isArray(poMastersConfigData?.product)
        ? poMastersConfigData?.product.map((item: any) => ({
          label: item?.productName,
          value: item.id.toString(),
        }))
        : [];
      objFormState.creditPeriod.value = rowData.creditPeriod;
      objFormState.po_name.value = rowData.po_name;
      objFormState.docType.value = rowData.docType;
      objFormState.poAmount.value = rowData.poAmount;
      objFormState.dueAmount.value = rowData.dueAmount;
      objFormState.end_date.value = rowData.end_date ? new Date(rowData.end_date) : '';
      objFormState.start_date.value = rowData.start_date ? new Date(rowData.start_date) : '';
      objFormState.noOfResources.value = rowData.noOfResources;
      if (rowData.poNumber) {
        objFormState.poNumber.value = rowData.poNumber;
        objFormState.poNumber.hideField = false;
      }
      if (rowData.srNumber) {
        objFormState.srNumber.value = rowData.srNumber;
        objFormState.srNumber.hideField = false;
      }

      objFormState.projectService.value = rowData.projectService ? rowData.projectService?.split(",") : "";
      objFormState.oem.value = rowData.oem ? rowData.oem?.split(",") : "";
      objFormState.product.value = rowData.product ? rowData.product?.split(",") : "";

      if (rowData?.technolgyGroup) {
        objFormState.technolgyGroup.value = rowData.technolgyGroup?.split(",");

        objFormState.technolgySubGroup.options = Array.isArray(poMastersConfigData?.technolgySubGroup)
          ? poMastersConfigData?.technolgySubGroup.filter((item: any) => Number(item.techGroupIds) == Number(rowData?.technolgyGroup)).map((item: any) => ({
            label: item?.name,
            value: item.id.toString(),
          }))
          : [];

        if (rowData.technolgySubGroup) {
          objFormState.technolgySubGroup.value = rowData.technolgySubGroup?.split(",");

          objFormState.technolgy.options = Array.isArray(poMastersConfigData?.technolgy)
            ? poMastersConfigData?.technolgy.filter((item: any) => Number(item.techSubgroupIds) == Number(rowData?.technolgySubGroup)).map((item: any) => ({
              label: item?.techName,
              value: item.id.toString(),
            }))
            : [];

          objFormState.technolgy.value = rowData.technolgy?.split(",");

        }


      }

      if (rowData?.technolgyGroup) {
        objFormState.technolgyGroup.value = rowData.technolgyGroup?.split(",");

        objFormState.technolgySubGroup.options = Array.isArray(poMastersConfigData?.technolgySubGroup)
          ? poMastersConfigData?.technolgySubGroup.filter((item: any) => Number(item.techGroupIds) == Number(rowData?.technolgyGroup)).map((item: any) => ({
            label: item?.name,
            value: item.id.toString(),
          }))
          : [];

        if (rowData.technolgySubGroup) {
          objFormState.technolgySubGroup.value = rowData.technolgySubGroup?.split(",");

          objFormState.technolgy.options = Array.isArray(poMastersConfigData?.technolgy)
            ? poMastersConfigData?.technolgy.filter((item: any) => Number(item.techSubgroupIds) == Number(rowData?.technolgySubGroup)).map((item: any) => ({
              label: item?.techName,
              value: item.id.toString(),
            }))
            : [];
          objFormState.technolgy.value = rowData.technolgy;
        }
      }


      const { groupIndustryData, industryData, industryHeadData, salesManagerData, accountManagerData } = cascadingData;

      if (rowData?.industryGroups) {
        objFormState.industryGroups.value = rowData.industryGroups.split(",");
        objFormState.subIndustries.options = groupIndustryData
          .filter((group: any) =>
            Number(group.groupIndustryId) === Number(rowData.industryGroups?.split(",")[0])
          )
          .flatMap((group: any) =>
            industryData
              .filter((industry: any) =>
                group.industryIds.split(',').includes(industry.industryId.toString())
              )
              .map((industry: any) => ({
                label: industry.industryName,
                value: industry.industryId.toString(),
              }))
          );
      }
      if (rowData?.subIndustries) {
        objFormState.subIndustries.value = rowData.subIndustries.split(",");
        objFormState.industryHead.options = industryHeadData
          .filter((head: any) =>
            head.industryIds.split(',').includes(rowData?.subIndustries ? rowData?.subIndustries?.split(",")[0] : '')
          )
          .map((head: any) => ({
            label: head.industryHeadName,
            value: head.industryHeadId.toString(),
          }));
      }

      if (rowData?.industryHead) {
        objFormState.industryHead.value = rowData.industryHead.split(",");
        objFormState.salesManager.options = salesManagerData
          .filter((manager: any) =>
            manager.industryHeadIds.split(',').includes(rowData.industryHead ? rowData.industryHead?.split(",")[0] : '')
          )
          .map((manager: any) => ({
            label: manager.salesManagerName,
            value: manager.salesManagerId.toString(),
          }));

        objFormState.accountManager.options = accountManagerData
          .filter((manager: any) =>
            manager.industryHeadIds.split(',').includes(rowData.industryHead ? rowData.industryHead?.split(",")[0] : '')
          )
          .map((manager: any) => ({
            label: manager.accountManagerName,
            value: manager.accountManagerId.toString(),
          }));
      }
      if (rowData?.salesManager) {
        objFormState.salesManager.value = rowData.salesManager.split(",");
      }
      if (rowData?.accountManager) {
        objFormState.accountManager.value = rowData.accountManager.split(",");
      }

      setLogoUrl(rowData?.filePath ? `${process.env.REACT_APP_API_BASEURL}/${rowData?.filePath}` : '');


      console.log('----------------1111111111111111', rowData.resourcesData);
      let arr = [...rowData.resourcesData];

      setTableData(arr);
      console.log('`${process.env.REACT_APP_API_BASEURL}/${rowData?.filePath}`', `${process.env.REACT_APP_API_BASEURL}/${rowData?.filePath}`)

      setFormPopup(true);

    } catch (error) {
      console.log("error", error);
    }
  };


  const formatDate = (dateString: any) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };


  const closeFormPopup = () => {
    setFormPopup(false);
    setobjFormState(_.cloneDeep(objForm));
  };

  function concatAddresses(address1: string, address2: string, address3: string) {
    // Check for null/undefined values and join non-empty addresses
    return [address1, address2, address3].filter((addr) => addr).join(", ");
  }



  const poContractHandler = async (form: FormType) => {
    console.log('form----->', form);
    const currentForm = _.cloneDeep(form);
    if (currentForm.client_name.value !== objFormState.client_name.value) {
      const configData = poContractConfData.find((item: any) => item.client_name == currentForm.client_name.value)
      if (configData) {
        currentForm.clientBillTo.options = configData.clientBill?.filter((item: any) => item.id).map((item: any, index: number) => {
          return {
            label: concatAddresses(item.address1, item.address2, item.address3),
            value: item.id.toString(),
            isDefault: index == 0 ? 1 : 0
          }
        })
        const defaultBillItem = currentForm.clientBillTo.options?.find((ele: any) => ele.isDefault == 1);
        if (defaultBillItem && defaultBillItem?.value) {
          currentForm.clientBillTo.value = [defaultBillItem?.value.toString()];
        }
        else {
          currentForm.clientBillTo.value = null;
        }
        currentForm.clientShipAddress.options = configData.clientShip?.filter((item: any) => item.id).map((item: any, index: number) => {
          return {
            label: concatAddresses(item.address1, item.address2, item.address3),
            value: item.id.toString(),
            isDefault: index == 0 ? 1 : 0
          }
        })
        const defaultShipItem = currentForm.clientShipAddress?.options?.find((ele: any) => ele.isDefault == 1);
        if (defaultShipItem && defaultShipItem?.value) {
          currentForm.clientShipAddress.value = [defaultShipItem?.value.toString()];
        }
        else {
          currentForm.clientShipAddress.value = null;
        }

        console.log('configData?.contacts', configData?.contacts);

        currentForm.clientContact.options = Array.isArray(configData?.contacts) ? configData.contacts?.filter((item: any) => item.id).map((item: any, index: number) => {
          return {
            label: item.name,
            value: item.id.toString(),
            isDefault: index == 0 ? 1 : 0
          }
        }) : []
        const defaultContact = currentForm.clientContact?.options?.find((ele: any) => ele.isDefault == 1);
        if (defaultContact && defaultContact?.value) {
          currentForm.clientContact.value = [defaultContact?.value.toString()];
        }
        else {
          currentForm.clientContact.value = null;
        }
        // currentForm.billFrom.options = Array.isArray(configData?.billFrom)? configData?.billFrom?.filter((item:any) => item.id).map((item:any,index:number) => {
        //   return {
        //     label:item.address1,
        //     value:item.id.toString()
        //   }
        // }):[]
        currentForm.companyName.value = configData?.companyInfo.companyName;
        currentForm.companyName.disable = false;


        currentForm.companyLocation.options = [{ label: concatAddresses(configData?.companyLocation?.address1, configData?.companyLocation?.address2, configData?.companyLocation?.address3) || "", value: configData?.companyLocation?.id.toString() }];
        currentForm.companyLocation.value = configData?.companyLocation?.id.toString()

      }
    }
    if (currentForm.docType.value !== objFormState.docType.value) {
      console.log('doctype handler---->', currentForm.docType.value);
      if (currentForm.docType.value == 'PO') {
        currentForm.poNumber.hideField = false;
        currentForm.srNumber.hideField = true;
      }
      else {
        currentForm.poNumber.hideField = true;
        currentForm.srNumber.hideField = false;
      }
    }
    if ((currentForm.technolgyGroup.value != objFormState.technolgyGroup.value) && currentForm.technolgyGroup.value) {
      currentForm.technolgySubGroup.options = Array.isArray(poMastersConfigData?.technolgySubGroup)
        ? poMastersConfigData?.technolgySubGroup.filter((item: any) => Number(item.techGroupIds) == Number(currentForm?.technolgyGroup?.value)).map((item: any) => ({
          label: item?.name,
          value: item.id.toString(),
        }))
        : [];
    }
    if ((currentForm.technolgySubGroup.value != objFormState.technolgySubGroup.value) && currentForm.technolgySubGroup.value) {
      currentForm.technolgy.options = Array.isArray(poMastersConfigData?.technolgy)
        ? poMastersConfigData?.technolgy.filter((item: any) => Number(item.techSubgroupIds) == Number(currentForm?.technolgySubGroup?.value)).map((item: any) => ({
          label: item?.techName,
          value: item.id.toString(),
        }))
        : [];
      console.log('tech array---->', poMastersConfigData?.technolgy.filter((item: any) => Number(item.techSubgroupIds) == Number(currentForm?.technolgySubGroup?.value)).map((item: any) => ({
        label: item?.name,
        value: item.id.toString(),
      })));
    }
    if (currentForm.poAmount.value != objFormState.poAmount.value) {
      currentForm.dueAmount.value = currentForm.poAmount.value;
    }
    const { groupIndustryData, industryData, industryHeadData, salesManagerData, accountManagerData } = cascadingData;

    // 1. Filter Sub-Industries Based on Selected Industry Groups
    if (
      currentForm.industryGroups.value !== objFormState.industryGroups.value &&
      currentForm.industryGroups.value
    ) {
      currentForm.subIndustries.options = groupIndustryData
        .filter((group: any) =>
          Number(group.groupIndustryId) === Number(currentForm.industryGroups.value)
        )
        .flatMap((group: any) =>
          industryData
            .filter((industry: any) =>
              group.industryIds.split(',').includes(industry.industryId.toString())
            )
            .map((industry: any) => ({
              label: industry.industryName,
              value: industry.industryId.toString(),
            }))
        );
    }

    // 2. Filter Industry Heads Based on Selected Sub-Industries
    if (
      currentForm.subIndustries.value !== objFormState.subIndustries.value &&
      currentForm.subIndustries.value
    ) {
      currentForm.industryHead.options = industryHeadData
        .filter((head: any) =>
          head.industryIds.split(',').includes(currentForm.subIndustries.value ? currentForm.subIndustries.value.toString() : '')
        )
        .map((head: any) => ({
          label: head.industryHeadName,
          value: head.industryHeadId.toString(),
        }));
    }


    if (
      currentForm.industryHead.value !== objFormState.industryHead.value &&
      currentForm.industryHead.value
    ) {
      currentForm.salesManager.options = salesManagerData
        .filter((manager: any) =>
          manager.industryHeadIds.split(',').includes(currentForm.industryHead.value ? currentForm.industryHead.value.toString() : '')
        )
        .map((manager: any) => ({
          label: manager.salesManagerName,
          value: manager.salesManagerId.toString(),
        }));
    }


    if (
      currentForm.industryHead.value !== objFormState.industryHead.value &&
      currentForm.industryHead.value
    ) {
      currentForm.accountManager.options = accountManagerData
        .filter((manager: any) =>
          manager.industryHeadIds.split(',').includes(currentForm.industryHead.value ? currentForm.industryHead.value.toString() : '')
        )
        .map((manager: any) => ({
          label: manager.accountManagerName,
          value: manager.accountManagerId.toString(),
        }));
    }
    
    setobjFormState(currentForm);
  };


  const getNamesFromOptions = (field: any) => {
    if (!field?.options || !Array.isArray(field.value)) return '';
    return field.value
      .map((value: string) => field.options.find((item: any) => item.value === value)?.label || '')
      .filter((name: string) => name !== '')
      .join(', ');
  };

  const returnNamesHandler = async (objectFormState: any) => {
    const obj = {
      projectService_names: objectFormState.projectService.options.find((item: any) => item.value === objectFormState.projectService.value)?.label || '',
      technolgyGroup_names: objectFormState.technolgyGroup.options.find((item: any) => item.value === objectFormState.technolgyGroup.value)?.label || '',
      technolgySubGroup_names: objectFormState.technolgySubGroup.options.find((item: any) => item.value === objectFormState.technolgySubGroup.value)?.label || '',
      technolgy_names: objectFormState.technolgy.options.find((item: any) => item.value === objectFormState.technolgy.value)?.label || '',
      oem_names: objectFormState.oem.options.find((item: any) => item.value === objectFormState.oem.value)?.label || '',
      product_names: objectFormState.product.options.find((item: any) => item.value === objectFormState.product.value)?.label || '',
      industryGroups_names: getNamesFromOptions(objectFormState.industryGroups),
      subIndustries_names: getNamesFromOptions(objectFormState.subIndustries),
      industryHead_names: getNamesFromOptions(objectFormState.industryHead),
      salesManager_names: getNamesFromOptions(objectFormState.salesManager),
      accountManager_names: getNamesFromOptions(objectFormState.accountManager),
      clientBillTo_names: getNamesFromOptions(objectFormState.clientBillTo),
      clientShipAddress_names: getNamesFromOptions(objectFormState.clientShipAddress),
      clientContact_names: getNamesFromOptions(objectFormState.clientContact),
      companyName: objectFormState.companyName?.value || '',
      companyLocation_names: objectFormState.projectService.options.find((item: any) => item.value === objectFormState.projectService.value)?.label || ''
    };
    return obj;
  };



  console.log('Data ---------------->', tableData);


  const createNewContract = async (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const formData: any = new FormData();

    setIsFormValid(companyValidityFlag);
    console.log('finalData---->', objFormState);
    const getAllMasterNames = await returnNamesHandler(objFormState);

    const obj = {
      clientId: poContractConfData.find((item: any) => item.client_name === objFormState.client_name.value)?.client_id || '',
      client_name: objFormState.client_name.value || '',
      clientBillTo: objFormState.clientBillTo.value?.toString() || '',
      clientShipAddress: objFormState.clientShipAddress.value?.toString() || '',
      clientContact: objFormState.clientContact.value?.toString() || '',
      companyName: objFormState.companyName.value || '',
      companyLocation: objFormState.companyLocation.value || '',
      creditPeriod: objFormState.creditPeriod.value,
      po_name: objFormState.po_name.value,
      poAmount: +objFormState.poAmount.value || null,
      dueAmount: +objFormState.dueAmount.value || null,
      start_date: objFormState.start_date.value ? formatDate(objFormState.start_date.value) : null,
      end_date: objFormState.end_date.value ? formatDate(objFormState.end_date.value) : null,
      projectService: objFormState.projectService.value?.toString() || '',
      technolgyGroup: objFormState.technolgyGroup.value?.toString() || '',
      technolgySubGroup: objFormState.technolgySubGroup.value?.toString() || '',
      technolgy: objFormState.technolgy.value?.toString() || '',
      oem: objFormState.oem.value?.toString() || '',
      product: objFormState.product.value?.toString() || '',
      docType: objFormState.docType.value || '',
      poNumber: objFormState.poNumber.value || '',
      srNumber: objFormState.srNumber.value || '',
      industryGroups: objFormState.industryGroups.value?.toString() || '',
      subIndustries: objFormState.subIndustries.value?.toString() || '',
      industryHead: objFormState.industryHead.value?.toString() || '',
      salesManager: objFormState.salesManager.value?.toString() || '',
      accountManager: objFormState.accountManager.value?.toString() || '',
      masterNames: JSON.stringify(getAllMasterNames) || '{}',
      noOfResources: objFormState.noOfResources.value || '',
      resourcesData: JSON.stringify(tableData) || '[]',
    };


    console.log('Names Object ----->', getAllMasterNames);
    console.log('obj ---------------->', obj);

    Object.entries(obj).forEach(([key, value]: any) => {
      formData.set(key, value);
    });

    if (attachments?.length) {
      console.log('Attachments ---->', attachments);
      formData.set("file", attachments[0]);
    }

    if (rowData && rowData?.id) {
      formData.set("id", rowData.id)
      poContractService
        .updatePoContract(formData)
        .then((response: any) => {
          console.log('Response ----->', response);
          if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
            closeFormPopup();
            getContractMaster();
            ToasterService.show(response?.message, CONSTANTS.SUCCESS);
          }
        })
        .catch((error: any) => {
          ToasterService.show(error, CONSTANTS.ERROR);
        });
    }
    else {
      poContractService
        .createPoContract(formData)
        .then((response: any) => {
          console.log('Response ----->', response);
          if (response?.statusCode === HTTP_RESPONSE.CREATED) {
            closeFormPopup();
            getContractMaster();
            ToasterService.show(response?.message, CONSTANTS.SUCCESS);
          }
        })
        .catch((error: any) => {
          ToasterService.show(error, CONSTANTS.ERROR);
        });
    }
  };


  const removeFileHandler = () => {
    setAttachments([]);
    setLogoUrl('');
  };
  const selectAttachment = (files: any) => {
    setAttachments([]);
    console.log('fileUrl--->123');
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          eventList.name
            .split(".")
          [eventList.name.split(".").length - 1].toLowerCase() ===
          FILE_TYPES.PDF
        ) {
          if (eventList.size > 10485760) {
            return ToasterService.show(
              "file size is too large, allowed maximum size is 10 MB.",
              "error"
            );
          } else {
            setAttachments((prevVals: any) => [...prevVals, eventList]);
            const fileURL = URL.createObjectURL(eventList);
            console.log('fileUrl--->', fileURL);
            setLogoUrl(fileURL)
          }
        } else {
          ToasterService.show(
            `Invalid file format you can only attach the pdf here!`,
            "error"
          );
          eventList = null;
        }
      });
    }
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
          label="Add New PO (Contract)"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={poContractsData}
          column={ContractTableColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 80px)"}
          downloadedfileName={"PO"}
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
                <h4 className="popup-heading">Add New PO (Contract)</h4>
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
                form={_.cloneDeep(objFormState)}
                formUpdateEvent={poContractHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
              {objFormState.noOfResources.value ?
                <EditableTable noOfRows={objFormState.noOfResources.value} tableData={tableData} setTableData={setTableData} />
                : null}
              {/* {(objFormState?.docType.value && objFormState?.docType.value != 'PO')? */}
              <div className={classes["upload-wrapper"]}>
                <div className="row pd-10-t-0">
                  <div
                    className={`col-md-12 ${classes["addition-field-header"]}`}
                  >
                    <h5 className="popup-heading">Select Document</h5>
                  </div>
                  <div className="col-md-12">
                    <div className={classes["upload-file-section"]}>
                      <div className={classes["upload-file"]}>
                        {logoUrl ? (
                          <div className={classes["image-preview"]}>
                            <div className="icon-ui677"> <i className="pi pi-times-circle" onClick={removeFileHandler} style={{ color: 'red', fontSize: '1rem' }}></i></div>
                            <img src={ImageUrl.PdfIcon} style={{ width: '200px', height: '130px' }} alt="Preview" />
                            {/* <img src={logoUrl} style={{ width: '200px', height: '130px' }} alt="Preview" /> */}
                            {/* <div className={classes["chip-tm"]}>
                              {attachments.map(
                                (
                                  item: { name: string | undefined },
                                  index: React.Key | null | undefined
                                ) => (
                                  <Chip
                                    label={item.name}
                                    removable
                                    onRemove={() => removeFileHandler()}
                                    key={index}
                                  />
                                )
                              )}
                            </div> */}
                          </div>
                        ) : (
                          <div className={classes["empty-upload"]}>
                            <input
                              type="file"
                              onClick={(event: any) => {
                                event.target.value = null;
                              }}
                              onChange={(e) => selectAttachment(e.target.files)}
                              className={classes["upload"]}
                              style={{ width: "unset" }}
                            />
                            <img
                              src={ImageUrl.FolderIconImage}
                              alt="Folder Icon"
                            />
                            <p>
                              Drag files here <span> or browse</span> <br />
                              <u>Support PDF</u>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* :null} */}

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