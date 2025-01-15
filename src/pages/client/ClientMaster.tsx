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


const ClientMaster = () => {
    const clientFormFields = {
        client_name: {
            inputType: "inputtext",
            label: "Client Name",
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        vega_client_name: {
            inputType: "inputtext",
            label: "Vega Client Name (Alias)",
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        client_type: {
            inputType: "singleSelect",
            label: "Client Type",
            options: ["PVT", "LLP", "Public", "Proprietorship"],
            value: null,
            validation: {
                required: false,
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
        client_status: {
            inputType: "singleSelect",
            label: "Client Type (Existing/New)",
            options: ["Existing", "New"],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        country_name: {
            inputType: "singleSelect",
            label: "Country (Base Location)",
            options: [],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        companyName: {
            inputType: "multiSelect",
            label: "Company",
            options: [],
            value: [],
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        account_name: {
            inputType: "singleSelect",
            label: "Account",
            options: [],
            value: [],
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        industry_name: {
            inputType: "singleSelect",
            label: "Industry",
            options: [],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        industryHeadNames: {
            inputType: "singleSelect",
            label: "Industry Head",
            options: [],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        industry_group: {
            inputType: "singleSelect",
            label: "Industry Group",
            options: [],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        industry_sub_group: {
            inputType: "singleSelect",
            label: "Industry Sub Group",
            options: [],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        sales_person: {
            inputType: "singleSelect",
            label: "Sales Person",
            options: [],
            value: [],
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
            prefilled: true,
        },
        account_manager: {
            inputType: "singleSelect",
            label: "Account Manager",
            options: [],
            value: [],
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
            prefilled: true,
        },
        msa_start_date: {
            inputType: "singleDatePicker",
            label: "MSA Start Dateee",
            value: null,
            disable: true,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        msa_end_date: {
            inputType: "singleDatePicker",
            label: "MSA End Date",
            value: null,
            disable: true,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        is_msa_missing: {
            inputType: "inputSwitch",
            label: "MSA Missing?",
            value: false,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        nda_flag: {
            inputType: "inputSwitch",
            label: "Is NDA",
            value: false,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        non_solicitation_clause: {
            inputType: "inputSwitch",
            label: "Non Solicitation Clause",
            value: false,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        use_logo_permission: {
            inputType: "inputSwitch",
            label: "Use Logo Permission",
            value: false,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
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




    const [clientFormFieldsStructure, setClientFormFieldsStructure]: any =
        useState(clientFormFields);
    const [clientForm, setClientForm] = useState<any>(
        _.cloneDeep(clientFormFieldsStructure)
    );

    const companyService = new CompanyMasterService();
    const clientService = new ClientMasterService();
    const accountService = new AccountMasterService();
    const accountsService = new AccountsMasterService();

    const cookies = new Cookies();
    const userInfo = cookies.get("userInfo");

    const loggedInUserId = userInfo?.userId;
    let patchData: any;
    const countryService = new CountryMasterService();
    const stateService = new StateMasterService();
    const industryService = new IndustryMasterService();

    const clientMasterColumns = [
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
                        className={`pi pi-${rowData.isactive ? "ban" : "check-circle"}`}
                        style={{ cursor: "pointer" }}
                        title={rowData.isactive ? "Deactivate" : "Activate"}
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
            body: (rowData: any) => (
                <div>
                    <span id={`clientNameTooltip-${rowData.id}`}>{rowData.client_name}</span>
                    <Tooltip target={`#clientNameTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Vega Client Name",
            fieldName: "vega_client_name",
            textAlign: "left",
            sort: true,
            filter: true,
            fieldValue: "vega_client_name",
            changeFilter: true,
            placeholder: "Vega Client Name",
            body: (rowData: any) => (
                <div>
                    <span id={`vegaClientNameTooltip-${rowData.id}`}>{rowData.vega_client_name}</span>
                    <Tooltip target={`#vegaClientNameTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Client Type",
            fieldName: "client_type",
            textAlign: "left",
            sort: true,
            filter: true,
            fieldValue: "client_type",
            changeFilter: true,
            placeholder: "Client Type",
            body: (rowData: any) => (
                <div>
                    <span id={`clientTypeTooltip-${rowData.id}`}>{rowData.client_type}</span>
                    <Tooltip target={`#clientTypeTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Credit Period (No. of Days)",
            fieldName: "credit_period",
            textAlign: "left",
            sort: true,
            filter: true,
            fieldValue: "credit_period",
            changeFilter: true,
            placeholder: "Credit Period",
            body: (rowData: any) => (
                <div>
                    <span id={`creditPeriodTooltip-${rowData.id}`}>{rowData.credit_period}</span>
                    <Tooltip target={`#creditPeriodTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Client Status",
            fieldName: "client_status",
            textAlign: "left",
            sort: true,
            filter: true,
            fieldValue: "client_status",
            changeFilter: true,
            placeholder: "Client Status",
            body: (rowData: any) => (
                <div>
                    <span id={`clientStatusTooltip-${rowData.id}`}>{rowData.client_status}</span>
                    <Tooltip target={`#clientStatusTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        },
        {
            label: "Country (Base Location)",
            fieldName: "country_name",
            textAlign: "left",
            sort: true,
            filter: true,
            fieldValue: "country_name",
            changeFilter: true,
            placeholder: "Country",
            body: (rowData: any) => (
                <div>
                    <span id={`countryTooltip-${rowData.id}`}>{rowData.country_name}</span>
                    <Tooltip target={`#countryTooltip-${rowData.id}`} position="top" />
                </div>
            ),
        }
    ];


    useEffect(() => {
        const fetchData = async () => {
            // await getStateMaster();
            const countries = await getCountryMaster();
            await formatCountryDetails(countries);
            const companies = await getCompanyMaster();
            await formatCompanyDetails(companies);
            const industryHead = await getIndustryHeadMaster();
            await formatIndustryHeadDetails(industryHead);
            const industryGroups = await getIndustryGroupMaster();
            await formatIndustryGroupDetails(industryGroups);
            const accountManagers = await getAccountManagerMaster();
            await formatAccountManagerMasterDetails(accountManagers);
            const accountMaster = await getAccountMaster();
            await formatAccountMasterDetails(accountMaster);
            const industries = await getIndustryMaster()
            await formatIndustry_ClientDetails(industries);

        };
        if (clientFormPopup == false && showConfirmDialogue == false) {
            fetchData();
        }
    }, [clientFormPopup, showConfirmDialogue]);

    const getClientMaster = async () => {
        setLoader(true);
        try {
            const response = await clientService.getClientMaster();
            setClientMaster(response?.clients);
            return response?.clients;
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    const getIndustryMaster = async () => {
        setLoader(true);
        try {
            const response = await industryService.getIndustryMaster();
            const temp = response?.industryMasters?.filter((item: any) => item?.isactive || item?.isActive)
            console.log('qqqqqqqqqqqq', temp);

            setIndustryMaster(temp);
            return temp;
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

    const getCountryMaster = async () => {
        setLoader(true);
        try {
            const response = await countryService.getCountryMaster();
            const temp = response?.countries?.filter((item: any) => item?.isactive || item?.isActive);
            setCountryMaster(temp);
            return temp;
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

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

    const getIndustryGroupMaster = async () => {
        setLoader(true);
        try {
            const response = await industryService.getIndustryGroupMaster();
            const temp = response?.groupIndustries?.filter((item: any) => item?.isactive || item?.isActive)
            setIndustryGroupMaster(temp);
            return temp;
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    const getAccountManagerMaster = async () => {
        setLoader(true);
        try {
            const response = await accountService.getAccountMaster();
            const temp = response?.accountManagers?.filter((item: any) => item?.isactive || item?.isActive)
            setAccountManagerMaster(temp);
            return temp;
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    const getAccountMaster = async () => {
        setLoader(true);
        try {
            const response = await accountsService.getAccountsMaster();
            const temp = response?.companyAccounts?.filter((item: any) => item?.isactive || item?.isActive)
            setAccountsMaster(temp);
            return temp;
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    const formatCountryDetails = async (countries: any = countryMaster) => {
        const countrylist = countries.map((country: any) => country?.name);
        clientFormFieldsStructure.country_name.options = countrylist;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await statesFormHandler(clientFormFieldsStructure);
    };

    const formatCompanyDetails = async (companies: any = companyMaster) => {
        const companyList = companies.map((company: any) => company?.companyName);
        clientFormFieldsStructure.companyName.options = companyList;
        setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatIndustryHeadDetails = async (
        industries: any = industryHeadMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.industryHeadName
        );
        clientFormFieldsStructure.industryHeadNames.options = industryHeadList;
        setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatIndustryGroupDetails = async (
        industries: any = industryGroupMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.groupIndustryName
        );
        clientFormFieldsStructure.industry_group.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatAccountManagerMasterDetails = async (
        industries: any = accountManagerMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.name
        );
        clientFormFieldsStructure.account_manager.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatAccountMasterDetails = async (
        industries: any = accountsMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.bankName
        );
        clientFormFieldsStructure.account_name.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatIndustry_ClientDetails = async (industries: any = industryMaster) => {
        const industryList = industries.map(
            (industry: any) => industry?.industryName
        );
        clientFormFieldsStructure.industry_name.options = industryList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        // await clientFormHandler(clientFormFieldsStructure);
    };



    const openSaveForm = async () => {
        setClientFormPopup(true);
    };

    const statesFormHandler = async (form: FormType) => {
        setClientForm(form);
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
        try {
            clientFormFieldsStructure.country_name.value = data?.name;
            clientFormFieldsStructure.stateName.value = data?.stateName;
            clientFormFieldsStructure.stateCode.value = data?.stateCode;
            clientFormFieldsStructure.gstCode.value = data?.gstCode;

            setClientForm(_.cloneDeep(clientFormFieldsStructure));
        } catch (error) {
            console.log("error", error);
        }
    };

    const createNewState = (event: FormEvent) => {
        event.preventDefault();
        let companyValidityFlag = true;
        const companyFormValid: boolean[] = [];

        _.each(clientForm, (item: any) => {
            if (item?.validation?.required) {
                companyFormValid.push(item.valid);
                companyValidityFlag = companyValidityFlag && item.valid;
            }
        });

        setIsFormValid(companyValidityFlag);

        const countryId =
            countryMaster.find(
                (country: any) => country.name === clientForm.country_name.value
            )?.id ?? null;

        if (companyValidityFlag) {
            const obj = {
                stateName: clientForm?.stateName?.value,
                stateCode: clientForm?.stateCode?.value,
                gstCode: clientForm?.gstCode?.value,
                countryId: countryId,
                isActive: 1,
                updatedBy: loggedInUserId,
            };

            if (!stateData?.id) {
                stateService
                    .createStateMaster(obj)
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
                const updatePayload = { ...obj, stateId: stateData?.id };

                stateService
                    .updateStateMaster(updatePayload)
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
        });
        setShowConfirmDialogue(true);
    };

    const confirmDelete = () => {
        setLoader(true);
        stateService
            .deactivateStateMaster({ ...patchData, loggedInUserId })
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
        setClientFormFieldsStructure(_.cloneDeep(clientFormFields));
        setClientForm(_.cloneDeep(clientFormFields));
    };

    const parseDateString = (dateString: any) => {
        const [year, month, day] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
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

    const selectDigitalSign = (files: any) => {
        setDigitalSign([]);
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
                        setDigitalSign((prevVals: any) => [...prevVals, eventList]);
                        const fileURL = URL.createObjectURL(eventList);
                        setSignatureUrl(fileURL);
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

    const removeFileHandler = () => {
        setAttachments([]);
        setLogoUrl('');
    };

    const removeSignHandler = () => {
        setDigitalSign([]);
        setSignatureUrl('');
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

        if (form?.is_msa_missing?.value == true) {
            setShowMSAAttacment(true);
            if (form.msa_start_date.validation) {
                form.msa_start_date.validation.required = true;
            }
            if (form.msa_end_date.validation) {
                form.msa_end_date.validation.required = true;
            }
            form.msa_start_date.disable = false;
            form.msa_end_date.disable = false;
        } else {
            setShowMSAAttacment(false);
            if (form.msa_start_date.validation) {
                form.msa_start_date.validation.required = false;
            }
            if (form.msa_end_date.validation) {
                form.msa_end_date.validation.required = false;
            }
            form.msa_start_date.disable = true;
            form.msa_end_date.disable = true;
        }

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

        // _.each(clientForm, (item: any) => {
        //   if (item?.validation?.required) {
        //     companyFormValid.push(item.valid);
        //     companyValidityFlag = companyValidityFlag && item.value;
        //   }
        // });

        setIsFormValid(companyValidityFlag);

        if (companyValidityFlag) {
            const industry_id =
                industryMaster.find(
                    (industry: any) =>
                        industry.industryName === clientForm.industry_name.value
                )?.id ?? null;
            console.log('createClientForm : ', companyMaster, clientForm.companyName.value);

            // const companyId =
            // companyMaster.find(
            //   (company: any) =>
            //     company.companyName === clientForm.companyName.value
            // )?.id ?? null;

            let companyId = "";
            clientForm?.companyName?.value?.forEach((item: any) => {
                const id =
                    companyMaster?.find(
                        (com: any) => com?.companyName == item
                    )?.id ?? null;
                if (id != null) {
                    companyId =
                        companyId != "" ? companyId + "," + id : id;
                }
            });

            const formData: any = new FormData();

            const obj = {
                client_name: clientForm?.client_name?.value,
                vega_client_name: clientForm?.vega_client_name?.value,
                client_type: clientForm?.client_type?.value,
                credit_period: clientForm?.credit_period?.value,
                client_status: clientForm?.client_status?.value,
                country_name: clientForm?.country_name?.value,
                companyId: companyId,
                account_selection: clientForm?.account_selection?.value,
                industryId: industry_id,
                industryHeadNames: clientForm?.industryHeadNames?.value,
                industry_group: clientForm?.industry_group?.value,
                industry_sub_group: clientForm?.industry_sub_group?.value,
                sales_person: clientForm?.sales_person?.value,
                account_manager: clientForm?.account_manager?.value,
                msa_start_date: formatDate(clientForm?.msa_start_date?.value),
                msa_end_date: formatDate(clientForm?.msa_end_date?.value),
                is_msa_missing: clientForm?.is_msa_missing?.value ? 1 : 0,
                nda_flag: clientForm?.nda_flag?.value ? 1 : 0,
                non_solicitation_clause: clientForm?.non_solicitation_clause?.value ? 1 : 0,
                use_logo_permission: clientForm?.use_logo_permission?.value ? 1 : 0,
                updated_by: loggedInUserId,

            };


            Object.entries(obj).forEach(([key, value]: any) => {
                formData.set(key, value);
            });


            if (attachments?.length) {
                formData.set("logo", attachments[0]);
            }

            if (digitalSign?.length) {
                formData.set("digitalSign", digitalSign[0]);
            }
            console.log("here formData", formData);

            console.log('createClientForm : ', clientForm, obj);


            if (!stateData?.id) {
                clientService
                    .createClientMaster(formData)
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
                const formData: any = new FormData();

                const updatePayload = { ...obj, id: stateData?.id };

                Object.entries(updatePayload).forEach(([key, value]: any) => {
                    formData.set(key, value);
                });

                // if (attachments?.length) {
                //   formData.set("file", attachments[0]);
                // }

                clientService
                    .updateClientMaster(formData)
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
                    label="Add New Client"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={openSaveForm}
                />
            </div>
            <p className="m-0">
                <DataTableBasicDemo
                    data={clientMaster}
                    column={clientMasterColumns}
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
                                <h4 className="popup-heading">{isEditState ? 'Update' : 'Add New'} Client</h4>
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



                            {/* attachment */}
                            {showNDAAttacment || showMSAAttacment ? <div className="row">
                                {showMSAAttacment ? <div className="col-md-6">
                                    <div className={classes["upload-wrapper"]}>
                                        <div className="row pd-10">
                                            <div
                                                className={`col-md-12 ${classes["addition-field-header"]}`}
                                            >
                                                <h5 className="popup-heading">MSA Attachment</h5>
                                            </div>
                                            <div className="col-md-12">
                                                <div className={classes["upload-file-section"]}>
                                                    <div className={classes["upload-file"]}>
                                                        {logoUrl ? (
                                                            <div className={classes["image-preview"]}>
                                                                <div className="icon-ui677"> <i className="pi pi-times-circle" onClick={removeFileHandler} style={{ color: 'red', fontSize: '1rem' }}></i></div>
                                                                <img src={logoUrl} style={{ width: '200px', height: '130px' }} alt="Preview" />
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
                                </div> : null}
                                {showNDAAttacment ? <div className="col-md-6">
                                    <div className={classes["upload-wrapper"]}>
                                        <div className="row pd-10">
                                            <div
                                                className={`col-md-12 ${classes["addition-field-header"]}`}
                                            >
                                                <h5 className="popup-heading">NDA Attachment</h5>
                                            </div>

                                            <div className="col-md-12">
                                                <div className={classes["upload-file-section"]}>
                                                    <div className={classes["upload-file"]}>
                                                        {signatureUrl ? (
                                                            <div className={classes["image-preview"]}>
                                                                <div className="icon-ui677"> <i className="pi pi-times-circle" onClick={removeSignHandler} style={{ color: 'red', fontSize: '1rem' }}></i></div>
                                                                <img src={signatureUrl} style={{ width: '200px', height: '130px' }} alt="Preview" />
                                                            </div>
                                                        ) : (
                                                            <div className={classes["empty-upload"]}>
                                                                <input
                                                                    type="file"
                                                                    onClick={(event: any) => {
                                                                        event.target.value = null;
                                                                    }}
                                                                    onChange={(e) =>
                                                                        selectDigitalSign(e.target.files)
                                                                    }
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
                                </div> : null}
                            </div> : null}
                            {/* attachment */}
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

export default ClientMaster;

