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

import { PoContractService}  from "../../services/po-contract/poContract.service";

const Contract: React.FC = () => {


  const objForm:any = {
    client_name: {
      inputType: "singleSelect",
      label: "Client",
      options: [],
      value: null,
      validation: {
        required:false
      },
      fieldWidth: "col-md-4",
    },
    clientBillTo: {
      inputType: "multiSelect",
      label: "Client Bill To",
      options: [],
      value: null,
      validation: {
        required:false
      },
      fieldWidth: "col-md-4",
    },
    clientShipAddress: {
      inputType: "multiSelect",
      label: "Client Shipping Address",
      options: [],
      value: null,
      validation: {
        required:false
      },
      fieldWidth: "col-md-4",
    },
    clientContact: {
      inputType: "singleSelect",
      label: "Contact",
      options: [],
      value: null,
      validation: {
        required:false
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
          required:false
        },
        fieldWidth: "col-md-4",
      },
      companyLocation: {
        inputType: "singleSelect",
        label: "Company Location",
        options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      creditPeriod: {
        inputType: "inputNumber",
        label: "Credit Period (Days)",

        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      poAmount: {
        inputType: "inputNumber",
        label: "Po Amount",
        // options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      dueAmount: {
        inputType: "inputNumber",
        label: "Due Amount",
        // options: [],
        disable:true,
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },

    start_date: {
      inputType: "singleDatePicker",
      label: "PO Start Date",
      value: null,
      validation: {
        required:false
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
        inputType: "singleSelect",
        label: "Service Type",
        options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      technolgyGroup: {
        inputType: "singleSelect",
        label: "Technology Group",
        options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      technolgySubGroup: {
        inputType: "singleSelect",
        label: "Technology Sub Group",
        options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      technolgy: {
        inputType: "singleSelect",
        label: "Technology",
        options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      oem: {
        inputType: "singleSelect",
        label: "OEM",
        options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },
      product: {
        inputType: "singleSelect",
        label: "Product",
        options: [],
        value: null,
        validation: {
          required:false
        },
        fieldWidth: "col-md-4",
      },

    docType: {
      inputType: "singleSelect",
      label: "Document Type",
      options: ["PO","SOW","Email"],
      value: null,
      validation: {
        required:false
      },
      fieldWidth: "col-md-4",
    },
    poNumber: {
      inputType: "inputtext",
      label: "PO Number",
      value: null,
      hideField:true,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    srNumber: {
      inputType: "inputtext",
      label: "Sr Number",
      value: null,
      hideField:true,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
  };
  const [contractMaster, setContractMaster] = useState<any>([]);
  const [clientListNames,setClientListNames] = useState<any>([]);
  const [poContractConfData,setPoContractConfData] = useState<any>([]);
  const [poMastersConfigData,setPoMastersConfigData] = useState<any>({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");
    const [logoUrl,setLogoUrl] = useState('');
      const [attachments, setAttachments]: any = useState([]);

  const loggedInUserId = userInfo?.userId;

  let patchData: any;

  const contractService = new ContractMasterService();
  const clientService = new ClientMasterService();

  useEffect(() => {
      
      getContractMaster();
      getPoContractConfiguration();
      getPOContractMasterConfigData();

  }, []);

  const poContractService = new PoContractService()


  const getContractMaster = async () => {
    // setLoader(true);
    // try {
    // //   const response = await contractService.getContractMaster();
    //   setContractMaster(response?.contracts);
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   setLoader(false);
    // }
  };
  const getPoContractConfiguration = async () => {
    setLoader(true);
    try {
      const response = await poContractService.getPoContractConfiguration();
      setPoContractConfData(response?.data);
      setClientListNames(response?.data?.map((item:any) => {
        return item.client_name 
        // return {
        //      label:item?.client_name,
        //      value:item?.id?.toString()
        // }
      }))
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  
  const getPOContractMasterConfigData = async () => {
    setLoader(true);
    try {
      const response = await poContractService.getPOContractMasterConfigData();
      console.log('------>',response?.data?.data)
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

  const deactivateContractMaster = () => {
    setLoader(true);
    contractService
      .deactivateContractMaster({...patchData, loggedInUserId})
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
  

  
  objFormState.technolgy.options = Array.isArray(poMastersConfigData?.technolgy)
    ? poMastersConfigData?.technolgy.map((item: any) => ({
        label: item?.techName,
        value: item.id.toString(),
      }))
    : [];
  
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

  console.log('data-------> ',poContractConfData);


  const onUpdate = (data: any) => {
    updateContractMaster(data);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
    setobjFormState(_.cloneDeep(objForm));
  };



  const updateContractMaster = (data: any) => {
    try {
    } catch (error) {
      console.log("error", error);
    }
  };



  const [objFormState, setobjFormState] = useState<any>(
    _.cloneDeep(objForm)
  );

  const closeFormPopup = () => {
    setFormPopup(false);
    setobjFormState(_.cloneDeep(objForm));
  };

  function concatAddresses(address1:string, address2:string, address3:string) {
    // Check for null/undefined values and join non-empty addresses
    return [address1, address2, address3].filter((addr) => addr).join(", ");
  }



  const poContractHandler = async (form: FormType) => {
    console.log('form----->',form);
    const currentForm = _.cloneDeep(form);
    if(currentForm.client_name.value !== objFormState.client_name.value){
        const configData = poContractConfData.find((item:any) => item.client_name == currentForm.client_name.value)
        if(configData){
            currentForm.clientBillTo.options = configData.clientBill?.filter((item:any) => item.id).map((item:any,index:number) => {
              return {
                label:concatAddresses(item.address1, item.address2, item.address3),
                value:item.id.toString(),
                isDefault:index == 0? 1:0
              }
            })
            const defaultBillItem = currentForm.clientBillTo.options?.find((ele:any) => ele.isDefault == 1 );
            if(defaultBillItem && defaultBillItem?.value){
              currentForm.clientBillTo.value = [defaultBillItem?.value.toString()];
            }
            else{
              currentForm.clientBillTo.value = null;
            }
            currentForm.clientShipAddress.options = configData.clientShip?.filter((item:any) => item.id).map((item:any,index:number) => {
              return {
                label:concatAddresses(item.address1, item.address2, item.address3),
                value:item.id.toString(),
                isDefault:index == 0? 1:0
              }
            })
            const defaultShipItem = currentForm.clientShipAddress?.options?.find((ele:any) => ele.isDefault == 1 );
            if(defaultShipItem && defaultShipItem?.value){
              currentForm.clientShipAddress.value = [defaultShipItem?.value.toString()];
            }
            else{
              currentForm.clientShipAddress.value = null;
            }
            currentForm.clientContact.options = Array.isArray(configData?.contacts)?configData.contacts?.filter((item:any) => item.id).map((item:any,index:number) => {
              return {
                label:item.name,
                value:item.id.toString(),
                isDefault:index == 0? 1:0
              }
            }):[]
            const defaultContact= currentForm.clientContact?.options?.find((ele:any) => ele.isDefault == 1 );
            if(defaultContact && defaultContact?.value){
              currentForm.clientContact.value = [defaultContact?.value.toString()];
            }
            else{
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

            
            currentForm.companyLocation.options = [{label:concatAddresses(configData?.companyLocation?.address1,configData?.companyLocation?.address2,configData?.companyLocation?.address3)||"",value:configData?.companyLocation?.id.toString()}];
            currentForm.companyLocation.value = configData?.companyLocation?.id.toString()

        }
    }
    if(currentForm.docType.value !== objFormState.docType.value){
      console.log('doctype handler---->',currentForm.docType.value);
      if(currentForm.docType.value == 'PO'){
        currentForm.poNumber.hideField = false;
        currentForm.srNumber.hideField = true;
      }
      else{
        currentForm.poNumber.hideField = true;
        currentForm.srNumber.hideField = false;
      }
    }
    if((currentForm.technolgyGroup.value != objFormState.technolgyGroup.value) && currentForm.technolgyGroup.value){
      currentForm.technolgySubGroup.options = Array.isArray(poMastersConfigData?.technolgySubGroup)
      ? poMastersConfigData?.technolgySubGroup.filter((item:any) => Number(item.techGroupIds) == Number(currentForm?.technolgyGroup?.value)).map((item: any) => ({
          label: item?.name,
          value: item.id.toString(),
        }))
      : [];
    }
    if((currentForm.technolgySubGroup.value != objFormState.technolgySubGroup.value) && currentForm.technolgySubGroup.value){
      currentForm.technolgy.options = Array.isArray(poMastersConfigData?.technolgy)
      ? poMastersConfigData?.technolgy.filter((item:any) => Number(item.techSubgroupIds) == Number(currentForm?.technolgySubGroup?.value)).map((item: any) => ({
          label: item?.techName,
          value: item.id.toString(),
        }))
      : [];
      console.log('tech array---->', poMastersConfigData?.technolgy.filter((item:any) => Number(item.techSubgroupIds) == Number(currentForm?.technolgySubGroup?.value)).map((item: any) => ({
        label: item?.name,
        value: item.id.toString(),
      })));
    }
    if(currentForm.poAmount.value != objFormState.poAmount.value){
      currentForm.dueAmount.value = currentForm.poAmount.value;
    }
    setobjFormState(currentForm);
  };

  const createNewContract = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    // const companyFormValid: boolean[] = [];
    // _.each(objFormState, (item: any) => {
    //   if (item?.validation?.required) {
    //     companyFormValid.push(item.valid);
    //     companyValidityFlag = companyValidityFlag && item.valid;
    //   }
    // });
    setIsFormValid(companyValidityFlag);
    console.log('finalData---->',objFormState);
    // const formattedDate =
    // objFormState.start_date?.value
    //   ? moment(new Date(objFormState.start_date.value)).isValid()
    //     ? moment(new Date(objFormState.start_date.value)).format('YYYY-MM-DD')
    //     : ''
    //   : '';
    //   const formattedEndDate =
    //   objFormState.end_date?.value
    //     ? moment(new Date(objFormState.end_date.value)).isValid()
    //       ? moment(new Date(objFormState.end_date.value)).format('YYYY-MM-DD')
    //       : ''
    //     : '';

    const obj = {
    clientId:10,
    client_name:objFormState.client_name.value || '',
    clientBillTo:objFormState.clientBillTo.value.toString() || '',
    clientShipAddress:objFormState.clientShipAddress.value.toString() || '',
    clientContact:objFormState.clientContact.value.toString() || '',
    // billFrom:objFormState.clientBillTo.value || '',
    companyName:objFormState.companyName.value || '',
    companyLocation:objFormState.companyLocation.value || '',
    creditPeriod:objFormState.creditPeriod.value,
    poAmount:objFormState.poAmount.value || '',
    dueAmount:objFormState.dueAmount.value || '',
    // start_date:moment(new Date(objFormState.start_date.value)).format('YYYY-MM-DD'), // Current date in YYYY-MM-DD format
    // end_date:objFormState.end_date.value,
    projectService:objFormState.projectService.value || '',
    technolgyGroup:objFormState.technolgyGroup.value || '',
    technolgySubGroup:objFormState.technolgySubGroup.value || '',
    technolgy:objFormState.technolgy.value || '',
    oem:objFormState.oem.value || '',
    product:objFormState.product.value || '',
    docType:objFormState.docType.value || '',
    poNumber:objFormState.poNumber.value || '',
    }
    console.log('object ----->',obj);
    // poContractService.createPoContract(obj).then(())

    poContractService
              .createPoContract(obj)
              .then((response: any) => {
                // if (response?.statusCode === HTTP_RESPONSE.CREATED) {
                //   setStateData({});
                //   closeFormPopup();
                //   ToasterService.show(response?.message, CONSTANTS.SUCCESS);
                // }
              })
              .catch((error: any) => {
                // setStateData({});
                ToasterService.show(error, CONSTANTS.ERROR);
              });

    

  };

  const removeFileHandler = () => {
    setAttachments([]);
    setLogoUrl('');
  };
    const selectAttachment = (files: any) => {
      setAttachments([]);
      if (files && files[0]) {
        _.each(files, (eventList) => {
          if (
            eventList.name
              .split(".")
              [eventList.name.split(".").length - 1].toLowerCase() ===
            FILE_TYPES.PNG
          ) {
            if (eventList.size > 10485760) {
              return ToasterService.show(
                "file size is too large, allowed maximum size is 10 MB.",
                "error"
              );
            } else {
              setAttachments((prevVals: any) => [...prevVals, eventList]);
              const fileURL = URL.createObjectURL(eventList);
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
                        {logoUrl  ? (
                          <div className={classes["image-preview"]}>
                            <div className="icon-ui677"> <i className="pi pi-times-circle" onClick={removeFileHandler} style={{ color: 'red',fontSize: '1rem' }}></i></div>
                            <img src={logoUrl} style={{width:'200px',height:'130px'}}  alt="Preview" />
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
                              <u>Support PNG</u>
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