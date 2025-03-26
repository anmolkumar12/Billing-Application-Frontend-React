import React, { FormEvent, useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ui/button/Button";
import DataTableBasicDemo from "../../components/ui/table/Table";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";
import FormComponent from "../../components/ui/form/form";
import classes from "./Client.module.scss";
import { CountryMasterService } from "../../services/masters/country-master/country.service";
import Cookies from "universal-cookie";
import { Tooltip } from "primereact/tooltip";
import _ from "lodash";
import { ToasterService } from "../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../constants/Constants";
import { FormType } from "../../schemas/FormField";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";
import { StateMasterService } from "../../services/masters/state-master/state.service";
import { Loader } from "../../components/ui/loader/Loader";
import { CompanyMasterService } from "../../services/masters/company-master/company.service";
import { IndustryMasterService } from "../../services/masters/industry-master/industry.service";
import { ClientMasterService } from "../../services/masters/client-master/client.service";
import { Chip } from "primereact/chip";
import { FILE_TYPES } from "../../enums/file-types.enum";
import { ImageUrl } from "../../utils/ImageUrl";
import { AccountMasterService } from "../../services/masters/account-manager-master/accountManager.service";
import { AccountsMasterService } from "../../services/masters/accounts-master/accounts.service";
import { ClientContactMasterService } from "../../services/clients/client-contact-master/clientContactMaster.service";


const ClientShipToMaster = () => {
  const ClientBillFormFields = {
    client_name: {
      inputType: "singleSelect",
      label: "Client",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
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
      fieldWidth: "col-md-6",
    },
    state_name: {
      inputType: "singleSelect",
      label: "State Name",
      options: [],
      value: null,
      disable: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    state_code:{
      inputType: "inputtext",
      label: "State Code",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",

    },
    gstIn: {
      inputType: "inputtext",
      label: "GSTN",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    placeOfSupply: {
      inputType: "inputtext",
      label: "Place of Supply",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    address1: {
      inputType: "inputtext",
      label: "Address 1",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    address2: {
      inputType: "inputtext",
      label: "Address 2",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    address3: {
      inputType: "inputtext",
      label: "Address 3",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    isDefaultAddress: {
      inputType: "inputSwitch",
      label: "Is It Default Address",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };


  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [stateMaster, setStateMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [clientFormPopup, setClientFormPopup] = useState(false);
  const [isEditState, setIsEditState] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const [industryHeadMaster, setIndustryHeadMaster] = useState<any>([]);
  const [industryMaster, setIndustryMaster] = useState<any>([]);
  const [attachments, setAttachments]: any = useState([]);
  const [digitalSign, setDigitalSign]: any = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [showNDAAttacment, setShowNDAAttacment] = useState(false);
  const [showMSAAttacment, setShowMSAAttacment] = useState(false);
  const [industryGroupMaster, setIndustryGroupMaster] = useState<any>([]);
  const [accountManagerMaster, setAccountManagerMaster] = useState<any>([]);
  const [accountsMaster, setAccountsMaster] = useState<any>([]);
  const [clientMaster, setClientMaster] = useState<any>([]);
  const [clientContactMaster, setClientContactMaster] = useState<any>([]);

  const [clientShipToMaster, setClientShipToMaster] = useState<any>([]);
  const [clientBillToMaster, setClientBillToMaster] = useState<any>([]);
  const [AdditionalDetailsForm, setAdditionalDetailsForm] = useState<any>({});

  // const [defaultBillingAddress,setDefaultBillingAddress] = useState<any>();



  const [clientBillFieldsStructure, setClientBillFieldsStructure]: any =
    useState(ClientBillFormFields);
  const [ClientBillForm, setClientBillForm] = useState<any>(
    _.cloneDeep(clientBillFieldsStructure)
  );

  const companyService = new CompanyMasterService();
  const clientContactService = new ClientContactMasterService();
  const accountService = new AccountMasterService();
  const accountsService = new AccountsMasterService();

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const countryService = new CountryMasterService();
  const stateService = new StateMasterService();
  const industryService = new IndustryMasterService();
  const clientService = new ClientMasterService();


  const ClientBillToMasterColumns = [
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
      label: "Client",
      fieldName: "client_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_name",
      changeFilter: true,
      placeholder: "Client",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.client_name}
          >
            {rowData.client_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    
    {
      label: "Address 1",
      fieldName: "address1",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "address1",
      changeFilter: true,
      placeholder: "Address 1",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.address1}
          >
            {rowData.address1}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Address 2",
      fieldName: "address2",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "address2",
      changeFilter: true,
      placeholder: "Address 2",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.address2}
          >
            {rowData.address2}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Address 3",
      fieldName: "address3",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "address3",
      changeFilter: true,
      placeholder: "Address 3",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.address3}
          >
            {rowData.address3}
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
          label: "State Name",
          fieldName: "state_name",
          textAlign: "left",
          sort: true,
          filter: true,
          fieldValue: "state_name",
          changeFilter: true,
          placeholder: "State Name",
          body: (rowData: any) => (
            <div>
              <span
                id={`companyNameTooltip-${rowData.id}`}
              // data-pr-tooltip={rowData.state_name}
              >
                {rowData.state_name}
              </span>
              <Tooltip
                target={`#companyNameTooltip-${rowData.id}`}
                position="top"
              />
            </div>
          ),
        },
        {
          label: "State Code",
          fieldName: "state_code",
          textAlign: "left",
          sort: true,
          filter: true,
          fieldValue: "state_code",
          changeFilter: true,
          placeholder: "State Code",
          body: (rowData: any) => (
            <div>
              <span
                id={`companyNameTooltip-${rowData.id}`}
              // data-pr-tooltip={rowData.state_code}
              >
                {rowData.state_code}
              </span>
              <Tooltip
                target={`#companyNameTooltip-${rowData.id}`}
                position="top"
              />
            </div>
          ),
        },
        {
          label: "GSTN",
          fieldName: "gstIn",
          textAlign: "left",
          sort: true,
          filter: true,
          fieldValue: "gstIn",
          changeFilter: true,
          placeholder: "gstn",
          body: (rowData: any) => (
            <div>
              <span
                id={`companyNameTooltip-${rowData.id}`}
              // data-pr-tooltip={rowData.gstIn}
              >
                {rowData.gstIn}
              </span>
              <Tooltip
                target={`#companyNameTooltip-${rowData.id}`}
                position="top"
              />
            </div>
          ),
        },
        {
          label: "Place Of Supply",
          fieldName: "placeOfSupply",
          textAlign: "left",
          sort: true,
          filter: true,
          fieldValue: "placeOfSupply",
          changeFilter: true,
          placeholder: "place of supply",
          body: (rowData: any) => (
            <div>
              <span
                id={`companyNameTooltip-${rowData.id}`}
              // data-pr-tooltip={rowData.placeOfSupply}
              >
                {rowData.placeOfSupply}
              </span>
              <Tooltip
                target={`#companyNameTooltip-${rowData.id}`}
                position="top"
              />
            </div>
          ),
        },
    {
      label: "Default Address",
      fieldName: "isDefaultAddress",
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
            {rowData.isDefaultAddress == 1 ? "Yes" : "No"}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Additional Address Details",
      fieldName: "additionalAddressDetails",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "additionalAddressDetails",
      changeFilter: true,
      placeholder: "Additional Address Details",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.additionalAddressDetails}
          >
            {rowData.additionalAddressDetails}
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
          <span style={{ color: rowData?.isActive === 1 ? "green" : "red" }}>
            {rowData?.isActive === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];



  useEffect(() => {
    const fetchData = async () => {
      await getClientShipToMaster();
      await getClientBillToMaster();
      const clients = await getClientMaster();
      const countries = await getCountryMaster();
      const states = await getStateMaster();
      await formatCountry_ClientDetails(countries);
      await formatState_ClientDetails(states);
      await formatClient_BillDetails(clients);
    };
    if (clientFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [clientFormPopup, showConfirmDialogue]);

  const getClientShipToMaster = async () => {
    setLoader(true);
    try {
      const response = await clientService.getClientShipToMaster();
      setClientShipToMaster(response?.data);
      // setDefaultBillingAddress(response?.data?.find((item:any) => item.isDefaultAddress == 1)); 
      return response?.data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  const getClientBillToMaster = async () => {
    // setLoader(true);
    try {
      const response = await clientService.getClientBillToMaster();
      setClientBillToMaster(response?.data);
      // setDefaultBillingAddress(response?.data?.find((item:any) => item.isDefaultAddress == 1) || {}); 
      // return response?.data;
    } catch (error) {
      console.error(error);
    } finally {
      // setLoader(false);
    }
  };

  const getCountryMaster = async () => {
    setLoader(true);
    try {
      const response = await countryService.getCountryMaster();
      const temp = response?.countries?.filter((item: any) => item?.isactive || item?.isActive)
      setCountryMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  const getStateMaster = async () => {
    setLoader(true);
    try {
      const response = await stateService.getStateMaster();
      const temp = response?.states?.filter((item: any) => item?.isactive || item?.isActive)
      setStateMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatCountry_ClientDetails = async (
    countries: any = countryMaster
  ) => {
    const countrylist = countries.map((country: any) => country?.name);
    clientBillFieldsStructure.country_name.options = countrylist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

  const formatState_ClientDetails = async (states: any = stateMaster) => {
    const statelist = states.map((state: any) => state.state_name);
    clientBillFieldsStructure.state_name.options = statelist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

  const formatClient_BillDetails = async (clients: any = clientMaster) => {
    const clientlist = clients.map((client: any) => client?.client_name);
    clientBillFieldsStructure.client_name.options = clientlist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

   const clientBillFormHandler = async (currentForm: FormType) => {
     const form = _.cloneDeep(currentForm);
     console.log('bbbbbbbbbb', form?.client_name?.value, ClientBillForm?.client_name?.value);
 
     if (form?.client_name?.value != ClientBillForm?.client_name?.value) {
       const selectedClient = clientMaster?.find(
         (item: any) => item?.client_name == form?.client_name?.value
       );

       const selectedCountry = countryMaster?.find(
         (item: any) => item?.name == selectedClient?.countryName
       );
       if (selectedCountry) {
         form.country_name.value = selectedClient?.countryName;
         // const stateList = await getStateMaster();
         // console.log('stateList---------------->',stateList);
         if (stateMaster) {
           // console.log('state-master',stateMaster)
           const stateNames = stateMaster?.map((state: any) => state.stateName);
           form.state_name.options = stateNames || [];
           form.state_name.value = null;
         }
        }

      // console.log('bbbbbbbbbb', response?.data, response?.data?.find((item:any) => item.isDefaultAddress == 1));
      const defaultBillingAddress = clientBillToMaster?.find((item:any) => item.client_name == form?.client_name?.value)
      console.log('bbbbbbbbbb', defaultBillingAddress);

        const parsedAdditionalAddress = defaultBillingAddress?.additionalAddressDetails && JSON.parse(defaultBillingAddress?.additionalAddressDetails)

         console.log("defaultBillingAddress ----->",defaultBillingAddress);
        if(defaultBillingAddress?.id){
          form.address1.value = defaultBillingAddress?.address1;
          form.address2.value = defaultBillingAddress?.address2;
          form.address3.value = defaultBillingAddress?.address3;
          form.state_name.value = defaultBillingAddress?.state_name;
          form.placeOfSupply.value = defaultBillingAddress?.placeOfSupply;
          form.state_code.value = defaultBillingAddress?.state_code;
          form.gstIn.value = defaultBillingAddress?.gstIn;
          // form.country_name.value = defaultBillingAddress?.countryName;  
          const addressDetails = JSON.parse(
            selectedCountry?.addressAdditionalFields
          );
          const detailsForm = Object.keys(addressDetails)?.reduce(
            (acc: any, item: any, index: any) => {
              const fieldLabel = addressDetails[item]; // Get label from addressAdditionalFields
              const matchedValue = parsedAdditionalAddress[fieldLabel]; // Match with parsedAdditionalAddress
    
              acc[index] = {
                inputType: "inputtext",
                label: fieldLabel,
                value: matchedValue || null, // Patch value if match found
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

         else {
         const addressDetails = JSON.parse(
           selectedCountry?.addressAdditionalFields
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

     setClientBillForm(form);
   };

  const additionalDetailsFormHandler = async (form: FormType) => {
    setAdditionalDetailsForm(form);
  };


  const getClientContactMaster = async () => {
    setLoader(true);
    try {
      const response = await clientContactService.getClientContactMaster();
      setClientContactMaster(response?.clientContacts);
      return response?.clientContacts;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  const getClientMaster = async () => {
    setLoader(true);
    try {
      const response = await clientService.getClientMaster();
      const temp = response?.clients?.filter((item: any) => item?.isactive || item?.isActive)
      setClientMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  // const formatClientDetails = async (clients: any = clientMaster) => {
  //     const clientList = clients.map((item: any) => item?.client_name);
  //     clientFormFieldsStructure.client_name.options = clientList;
  //     await setClientFormFieldsStructure(clientFormFieldsStructure);
  //     await clientContactFormHandler(clientFormFieldsStructure);
  // };

  // const clientContactFormHandler = async (form: FormType) => {
  //     setClientForm(form);
  // };

  const openSaveForm = async () => {
    setClientFormPopup(true);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateClientBillToMaster(data);
    setClientFormPopup(true);
    setIsEditState(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateClientBillToMaster = async (data: any) => {
    console.log('data------->',data);
    try {
      ClientBillForm.client_name.value = data?.client_name;
      ClientBillForm.address1.value = data?.address1;
      ClientBillForm.address2.value = data?.address2;
      ClientBillForm.address3.value = data?.address3;
      ClientBillForm.state_name.options = stateMaster?.map((state: any) => state.stateName) || []
      ClientBillForm.state_code.value = data?.state_code;
      ClientBillForm.gstIn.value = data?.gstIn;
      ClientBillForm.placeOfSupply.value = data?.placeOfSupply;
      ClientBillForm.state_name.value = data?.state_name;
      // ClientBillForm.pin.value = data?.pin;
      ClientBillForm.country_name.value = data?.countryName;
      ClientBillForm.isDefaultAddress.value = data?.isDefaultAddress == 1 ? true : false;

      // ClientBillForm.state_name.value = data?.state_name;

      // setClientBillForm(_.cloneDeep(clientBillFieldsStructure)); 
      const addressDetails = JSON.parse(data?.additionalAddressDetails);

      if(Object.keys(addressDetails)?.length){

      const addressForm = Object.keys(addressDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: item,
            value: addressDetails[item],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      setAdditionalDetailsForm(addressForm);
    }
    else{
      const selectedCountry = countryMaster?.find(
        (item: any) => item?.name == data?.countryName
      );
      const addressDetails = JSON.parse(
        selectedCountry?.addressAdditionalFields
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
    } catch (error) {
      console.log("error", error);
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
    });
    setShowConfirmDialogue(true);
  };

  const confirmDelete = () => {
    setLoader(true);
    clientService
      .deactivateClientShipToMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `State record ${patchData?.isactive ? "deactivated" : "activated"
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
    setClientFormPopup(false);
    setIsEditState(false);
    setStateData({});
    setClientBillFieldsStructure(_.cloneDeep(ClientBillFormFields));
    setClientBillForm(_.cloneDeep(ClientBillFormFields));
    setAdditionalDetailsForm({});

  };

  const createClientShipInfo = async (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ClientBillForm, (item: any) => {
      if (item?.validation?.required) {
        // companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.value;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const clientId =
        clientMaster.find(
          (client: any) => client.client_name === ClientBillForm.client_name.value
        )?.id ?? null;

      const countryId =
        countryMaster.find(
          (country: any) => country.name === ClientBillForm.country_name.value
        )?.id ?? null;

      if (ClientBillForm?.isDefaultAddress?.value == true) {
        let defaultAccountFlag = false;
        clientShipToMaster
          ?.filter(
            (acc: any) => acc?.client_name == ClientBillForm.client_name.value
          )
          ?.forEach((item: any) => {
            defaultAccountFlag = defaultAccountFlag || item?.isDefaultAddress;
          });
        if (defaultAccountFlag) {
          ToasterService.show(
            "A default address for this company is already present",
            CONSTANTS.ERROR
          );
          return;
        }
      }

      // const stateId =
      //   stateMaster.find(
      //     (state: any) => state.state_name === ClientBillForm.state_name.value
      //   )?.state_id ?? null;

      const addressData = Object.keys(AdditionalDetailsForm)?.reduce(
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
        clientId: clientId,
        countryId: countryId,
        state_name:ClientBillForm?.state_name?.value,
        state_code:ClientBillForm?.state_code?.value,
        gstIn:ClientBillForm?.gstIn?.value,
        placeOfSupply:ClientBillForm?.placeOfSupply?.value,
        address1: ClientBillForm?.address1?.value,
        address2: ClientBillForm?.address2?.value,
        address3: ClientBillForm?.address3?.value,
        additionalAddressDetails: addressData,
        isDefaultAddress: ClientBillForm?.isDefaultAddress?.value == true ? 1 : 0,
        updated_by: loggedInUserId,
      };

      if (!stateData?.id) {
        clientService
          .createClientShipToMaster(obj)
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
        const updatePayload = { ...obj, id: stateData?.id };

        clientService
          .updateClientShipToMaster(updatePayload)
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
          label="Add New Shipping Info"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={clientShipToMaster}
          column={ClientBillToMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Client_Ship_To"}
        />
        {showConfirmDialogue ? (
          <ConfirmDialogue
            actionPopupToggle={actionPopupToggle}
            onCloseFunction={onPopUpClose}
          />
        ) : null}
      </p>
      {clientFormPopup ? (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body stretchLeft">
            <div className="popup-header ">
              <div
                className="popup-close"
                onClick={() => {
                  closeFormPopup();
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">{isEditState ? 'Update' : 'Add New'} Shipping Info</h4>
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
                form={_.cloneDeep(ClientBillForm)}
                formUpdateEvent={clientBillFormHandler}
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
                submitEvent={createClientShipInfo}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ClientShipToMaster;


