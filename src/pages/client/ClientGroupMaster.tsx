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
import moment from "moment";


const ClientGroupMaster = () => {
  const ClientBillFormFields = {
    client_name: {
      inputType: "multiSelect",
      label: "Client",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    group_name: {
      inputType: "inputtext",
      label: "Group Name",
      value: null,
      validation: {
        required: true,
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

  const [clientBillToMaster, setClientBillToMaster] = useState<any>([]);
  const [AdditionalDetailsForm, setAdditionalDetailsForm] = useState<any>({});



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
      fieldName: "clientName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "clientName",
      changeFilter: true,
      placeholder: "Client",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.clientName}
          >
            {rowData.clientName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Group Name",
      fieldName: "groupName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "groupName",
      changeFilter: true,
      placeholder: "Group Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.address1}
          >
            {rowData.groupName}
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
      await getClientBillToMaster();
      const clients = await getClientMaster();
      const countries = await getCountryMaster();
    //   const states = await getStateMaster();
    //   await formatCountry_ClientDetails(countries);
    //   await formatState_ClientDetails(states);
      await formatClient_BillDetails(clients);
    };
    if (clientFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [clientFormPopup, showConfirmDialogue]);

  const getClientBillToMaster = async () => {
    setLoader(true);
    try {
      const response = await clientService.getClientGroupsMaster();
       response?.groups?.forEach((el: any) => {
       el.updated_at = el.updated_at ?  moment(el.updated_at).format("DD-MM-YYYY HH:mm:ss") : null;
       });
      setClientBillToMaster(response?.groups);
      return response?.groups;
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
      setStateMaster(response?.states);
      return response?.states;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

//   const formatCountry_ClientDetails = async (
//     countries: any = countryMaster
//   ) => {
//     const countrylist = countries.map((country: any) => country?.name);
//     clientBillFieldsStructure.country_name.options = countrylist;
//     await setClientBillFieldsStructure(clientBillFieldsStructure);
//     await clientBillFormHandler(clientBillFieldsStructure);
//   };

//   const formatState_ClientDetails = async (states: any = stateMaster) => {
//     const statelist = states.map((state: any) => state.state_name);
//     // clientBillFieldsStructure.state_name.options = statelist;
//     await setClientBillFieldsStructure(clientBillFieldsStructure);
//     await clientBillFormHandler(clientBillFieldsStructure);
//   };

  const formatClient_BillDetails = async (clients: any = clientMaster) => {
    const clientlist = clients.map((client: any) => client?.client_name);
    clientBillFieldsStructure.client_name.options = clientlist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

  const clientBillFormHandler = async (form: FormType) => {
    setClientBillForm(form);
    // if (form?.client_name?.value != ClientBillForm?.client_name?.value) {
    // const selectedClient = clientMaster?.find(
    //   (item: any) => item?.client_name == form?.client_name?.value
    // );
    // const selectedCountry = countryMaster?.find(
    //   (item: any) => item?.name == selectedClient?.countryName
    // );
    // if (selectedCountry) {
    //   form.country_name.value = selectedClient?.countryName;

    //   const addressDetails = JSON.parse(
    //     selectedCountry?.addressAdditionalFields
    //   );
    // }
    // }

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
    try {
      console.log('rrrrrrrrrrrrrrrr', data);
      
      clientBillFieldsStructure.client_name.value = data?.clientName?.split(',');
      clientBillFieldsStructure.group_name.value = data?.groupName;

      setClientBillFieldsStructure(_.cloneDeep(clientBillFieldsStructure));
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
      .toggleClientGroupStatus({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Client group record ${patchData?.isactive ? "deactivated" : "activated"
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
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });
    console.log('clientForm', ClientBillForm, companyValidityFlag);

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
        let clientId = ClientBillForm?.client_name?.value
        ?.map((item: any) =>
            clientMaster?.find((com: any) => com?.client_name === item)?.id
        )
        .filter((id: any) => id !== undefined && id !== null)
        .join(",");

      const obj = {
        clientId: clientId,
        groupName: ClientBillForm?.group_name?.value,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        clientService
          .createClientGroupMaster(obj)
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
          .updateClientGroupMaster(updatePayload)
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
          label="Add New Client Group"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={clientBillToMaster}
          column={ClientBillToMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Client_Group"}
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
                <h4 className="popup-heading">{isEditState ? 'Update' : 'Add New'} Client Group</h4>
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

export default ClientGroupMaster;



