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


const ClientContactMaster = () => {
    const ClientContactFormFields = {
        client_name: {
            inputType: "singleSelect",
            label: "Client",
            options: [],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-6",
        },
        salutation: {
            inputType: "singleSelect",
            label: "Salutation",
            options: ["Mr.", "Ms.", "Mrs."],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-6",
        },
        first_name: {
            inputType: "inputtext",
            label: "First Name",
            value: null,
            validation: {
                required: true,
            },
            fieldWidth: "col-md-6",
        },
        last_name: {
            inputType: "inputtext",
            label: "Last Name",
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-6",
        },
        email: {
            inputType: "inputtext",
            label: "Email",
            value: null,
            validation: {
                required: false,
                // pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
            fieldWidth: "col-md-6",
        },
        phone: {
            inputType: "inputtext",
            label: "Phone Number",
            value: null,
            validation: {
                required: false,
                // pattern: /^\d{10}$/,
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


    const [clientFormFieldsStructure, setClientFormFieldsStructure]: any =
        useState(ClientContactFormFields);
    const [clientForm, setClientForm] = useState<any>(
        _.cloneDeep(clientFormFieldsStructure)
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


    const clientContactColumns = [
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
            label: "Client Name",
            fieldName: "client_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Client Name",
            body: (rowData: any) => (
                <div>
                    <span id={`clientNameTooltip-${rowData.id}`}>{rowData.client_name}</span>
                    <Tooltip target={`#clientNameTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Salutation",
            fieldName: "salutation",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Salutation",
            body: (rowData: any) => (
                <div>
                    <span id={`salutationTooltip-${rowData.id}`}>{rowData.salutation}</span>
                    <Tooltip target={`#salutationTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "First Name",
            fieldName: "first_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "First Name",
            body: (rowData: any) => (
                <div>
                    <span id={`firstNameTooltip-${rowData.id}`}>{rowData.first_name}</span>
                    <Tooltip target={`#firstNameTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Last Name",
            fieldName: "last_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Last Name",
            body: (rowData: any) => (
                <div>
                    <span id={`lastNameTooltip-${rowData.id}`}>{rowData.last_name}</span>
                    <Tooltip target={`#lastNameTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Email",
            fieldName: "email",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Email",
            body: (rowData: any) => (
                <div>
                    <span id={`emailTooltip-${rowData.id}`}>{rowData.email}</span>
                    <Tooltip target={`#emailTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Phone Number",
            fieldName: "phone_number",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Phone Number",
            body: (rowData: any) => (
                <div>
                    <span id={`phoneTooltip-${rowData.id}`}>{rowData.phone_number}</span>
                    <Tooltip target={`#phoneTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Status",
            fieldName: "isActive",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Status",
            body: (rowData: any) => (
                <div>
                    <span style={{ color: rowData?.isActive === 1 ? "green" : "red" }}>
                        {rowData?.isActive === 1 ? "Active" : "Inactive"}
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
            placeholder: "Updated By",
            body: (rowData: any) => (
                <div>
                    <span>{rowData.updated_by}</span>
                </div>
            ),
        },
        {
            label: "Updated At",
            fieldName: "updated_at",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Updated At",
            body: (rowData: any) => (
                <div>
                    <span>{rowData.updated_at}</span>
                    {/* <span>{new Date(rowData.updated_at).toLocaleString()}</span> */}
                </div>
            ),
        }
    ];



    useEffect(() => {
        const fetchData = async () => {
            await getClientContactMaster();
            const clients = await getClientMaster();
            await formatClientDetails(clients);
        };
        if (clientFormPopup == false && showConfirmDialogue == false) {
            fetchData();
        }
    }, [clientFormPopup, showConfirmDialogue]);

    const getClientContactMaster = async () => {
        setLoader(true);
        try {
            const response = await clientContactService.getClientContactMaster();
            console.log(`chwckdas`,)
             response?.clientContacts?.forEach((el: any) => {
             el.updated_at = el.updated_at ?  moment(el.updated_at).format("DD-MM-YYYY HH:mm:ss") : null;
             });
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

    const formatClientDetails = async (clients: any = clientMaster) => {
        const clientList = clients.map((item: any) => item?.client_name);
        clientFormFieldsStructure.client_name.options = clientList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientContactFormHandler(clientFormFieldsStructure);
    };

    const clientContactFormHandler = async (form: FormType) => {
        setClientForm(form);
    };

    const openSaveForm = async () => {
        setClientFormPopup(true);
    };

    const onUpdate = (data: any) => {
        setStateData(data);
        updateStateMaster(data);
        setClientFormPopup(true);
        setIsEditState(true);
    };

    const onPopUpClose = (e?: any) => {
        setShowConfirmDialogue(false);
    };

    const updateStateMaster = (data: any) => {
        console.log('rrrrrrrrrrrr', data);

        try {
            clientFormFieldsStructure.client_name.value = data?.client_name;
            clientFormFieldsStructure.salutation.value = data?.salutation;
            clientFormFieldsStructure.first_name.value = data?.first_name;
            clientFormFieldsStructure.last_name.value = data?.last_name;
            clientFormFieldsStructure.email.value = data?.email;
            clientFormFieldsStructure.phone.value = data?.phone_number;

            setClientForm(_.cloneDeep(clientFormFieldsStructure));
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
        clientContactService
            .deactivateClientContactMaster({ ...patchData, loggedInUserId })
            .then(() => {
                setLoader(false);
                setShowConfirmDialogue(false);
                ToasterService.show(
                    `Client contact record ${patchData?.isactive ? "deactivated" : "activated"
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
        setClientFormFieldsStructure(_.cloneDeep(ClientContactFormFields));
        setClientForm(_.cloneDeep(ClientContactFormFields));
    };


    const clientFormHandler = async (currentForm: FormType) => {
        const form = _.cloneDeep(currentForm);
        // if (form?.companyName?.value != clientForm?.companyName?.value) {
        const selectedCompany = companyMaster?.find(
            (item: any) => item?.companyName == form?.companyName?.value
        );
        const selectedCountry = countryMaster?.find(
            (item: any) => item?.name == selectedCompany?.countryName
        );
        if (form?.nda_flag?.value == true) {
            setShowNDAAttacment(true);
        } else {
            setShowNDAAttacment(false);
        }

        // if (form?.is_msa_missing?.value == true) {
        //     setShowMSAAttacment(true);
        //     if (form.msa_start_date.validation) {
        //         form.msa_start_date.validation.required = true;
        //     }
        //     if (form.msa_end_date.validation) {
        //         form.msa_end_date.validation.required = true;
        //     }
        //     form.msa_start_date.disable = false;
        //     form.msa_end_date.disable = false;
        // } else {
        //     setShowMSAAttacment(false);
        //     if (form.msa_start_date.validation) {
        //         form.msa_start_date.validation.required = false;
        //     }
        //     if (form.msa_end_date.validation) {
        //         form.msa_end_date.validation.required = false;
        //     }
        //     form.msa_start_date.disable = true;
        //     form.msa_end_date.disable = true;
        // }

        console.log('isMSAChecked', form);

        //   if (selectedCountry) {
        //     form.country_name.value = selectedCompany?.countryName;
        //     const stateList = await getStateMaster(selectedCountry?.id);
        //     if (stateList) {
        //       const stateNames = stateList?.map((state: any) => state.stateName);
        //       form.state_name.options = stateNames || [];
        //       form.state_name.value = null;
        //     }
        //   }
        // }
        setClientForm(form);
    };

    const createNewClient = async (event: FormEvent) => {
        event.preventDefault();
        let companyValidityFlag = true;
        const companyFormValid: boolean[] = [];

        _.each(clientForm, (item: any) => {
            if (item?.validation?.required) {
                // companyFormValid.push(item.valid);
                companyValidityFlag = companyValidityFlag && item.value;
            }
        });

        setIsFormValid(companyValidityFlag);

        if (companyValidityFlag) {

            //     // const companyId =
            //     // companyMaster.find(
            //     //   (company: any) =>
            //     //     company.companyName === clientForm.companyName.value
            //     // )?.id ?? null;


            const obj = {
                client_name: clientForm?.client_name?.value,
                salutation: clientForm?.salutation?.value,
                first_name: clientForm?.first_name?.value,
                last_name: clientForm?.last_name?.value,
                email: clientForm?.email?.value,
                phone_number: clientForm?.phone?.value,
                updatedBy: loggedInUserId,
            };
            console.log('koooo', obj);


            if (!stateData?.id) {
                clientContactService
                    .createClientContactMaster(obj)
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
                const updatePayload = { ...obj, clientContactId: stateData?.id, isActive: stateData?.isActive };
                clientContactService
                    .updateClientContactMaster(updatePayload)
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
                    label="Add New Contact"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={openSaveForm}
                />
            </div>
            <p className="m-0">
                <DataTableBasicDemo
                    data={clientContactMaster}
                    column={clientContactColumns}
                    showGridlines={true}
                    resizableColumns={true}
                    rows={20}
                    paginator={true}
                    sortable={true}
                    headerRequired={true}
                    scrollHeight={"calc(100vh - 200px)"}
                    downloadedfileName={"Client_Contact"}
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
                                <h4 className="popup-heading">{isEditState ? 'Update' : 'Add New'} Contact</h4>
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
                                form={_.cloneDeep(clientForm)}
                                formUpdateEvent={clientFormHandler}
                                isFormValidFlag={isFormValid}
                            ></FormComponent>
                        </div>

                        <div className="popup-lower-btn">
                            <ButtonComponent
                                label="Submit"
                                icon="pi pi-check"
                                iconPos="right"
                                submitEvent={createNewClient}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ClientContactMaster;

