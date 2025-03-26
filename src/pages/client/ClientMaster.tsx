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
import { SalesMasterService } from "../../services/masters/sales-master/sales.service";


const ClientMaster = () => {
    const clientFormFields = {
        client_name: {
            inputType: "inputtext",
            label: "Client Name",
            value: null,
            validation: {
                required: true,
            },
            fieldWidth: "col-md-4",
        },
        is_same_alias: {
            inputType: "inputSwitch",
            label: "Alias same as client name",
            value: false,
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
                required: true,
            },
            fieldWidth: "col-md-4",
        },
        client_type: {
            inputType: "singleSelect",
            label: "Client Type",
            options: ["PVT", "LLP", "Public", "Proprietorship", "Others"],
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
                required: true,
            },
            fieldWidth: "col-md-4",
        },
        // client_status: {
        //     inputType: "singleSelect",
        //     label: "Client Status",
        //     options: ["Existing", "New"],
        //     value: null,
        //     validation: {
        //         required: true,
        //     },
        //     fieldWidth: "col-md-4",
        // },
        country_name: {
            inputType: "singleSelect",
            label: "Country",
            options: [],
            value: null,
            validation: {
                required: true,
            },
            fieldWidth: "col-md-4",
        },
        companyName: {
            inputType: "singleSelect",
            label: "Company",
            options: [],
            value: null,
            validation: {
                required: true,
            },
            fieldWidth: "col-md-4",
        },
        account_name: {
            inputType: "multiSelect",
            label: "Bank Name",
            options: [],
            value: [],
            validation: {
                required: true,
            },
            fieldWidth: "col-md-4",
        },
        industryHeadNames: {
            inputType: "singleSelect",
            label: "Industry Head",
            options: [],
            value: null,
            validation: {
                required: true,
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
        industry_name: {
            inputType: "singleSelect",
            label: "Industry Sub Group",
            options: [],
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        // industry_sub_group: {
        //     inputType: "singleSelect",
        //     label: "Industry Sub Group",
        //     options: [],
        //     value: null,
        //     validation: {
        //         required: true,
        //     },
        //     fieldWidth: "col-md-4",
        // },
        sales_person: {
            inputType: "multiSelect",
            label: "Sales Person",
            options: [],
            value: [],
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        account_manager: {
            inputType: "multiSelect",
            label: "Account Manager",
            options: [],
            value: [],
            validation: {
                required: false,
            },
            fieldWidth: "col-md-4",
        },
        msa_start_date: {
            inputType: "singleDatePicker",
            label: "MSA Start Date",
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
            label: "Is MSA",
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


    const msaFormFields = {
        start_date: {
            inputType: "singleDatePicker",
            label: "Start Date",
            value: null,
            validation: {
                required: true,
            },
            fieldWidth: "col-md-6",
        },
        end_date: {
            inputType: "singleDatePicker",
            label: "End Date",
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
    const [isEditClient, setIsEditClient] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState(true);
    const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
    const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
    const [cliendData, setCliendData] = useState<any>();
    const [companyMaster, setCompanyMaster] = useState<any>([]);
    const [industryHeadMaster, setIndustryHeadMaster] = useState<any>([]);
    const [industryMaster, setIndustryMaster] = useState<any>([]);
    const [attachments, setAttachments]: any = useState([]);
    const [digitalSign, setDigitalSign]: any = useState([]);
    const [logoUrl, setLogoUrl] = useState('');
    const [signatureUrl, setSignatureUrl] = useState('');
    const [showNDAAttacment, setShowNDAAttacment] = useState<boolean>(false);
    const [showMSAAttacment, setShowMSAAttacment] = useState<boolean>(false);
    const [industryGroupMaster, setIndustryGroupMaster] = useState<any>([]);
    const [accountManagerMaster, setAccountManagerMaster] = useState<any>([]);
    const [accountsMaster, setAccountsMaster] = useState<any>([]);
    const [clientMaster, setClientMaster] = useState<any>([]);
    const [salesMaster, setSalesMaster] = useState<any>([]);
    const [showMsaUpdatePopup, setShowMsaUpdatePopup] = useState<boolean>(false);


    const [clientFormFieldsStructure, setClientFormFieldsStructure]: any =
        useState(clientFormFields);
    const [clientForm, setClientForm] = useState<any>(
        _.cloneDeep(clientFormFieldsStructure)
    );

    const [msaFormFieldsStructure, setMsaFormFieldsStructure]: any =
        useState(msaFormFields);
    const [msaForm, setMsaForm] = useState<any>(
        _.cloneDeep(msaFormFieldsStructure)
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
    const salesService = new SalesMasterService();


    const clientMasterColumns = [
        {
            label: "Action",
            fieldName: "action",
            textAlign: "left",
            frozen: true,
            sort: false,
            filter: false,
            body: (rowData: any) => (
                <div style={{ display: "flex", gap: "12px", marginLeft: "20px" }}>
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
                    <span
                        className="pi pi-sync"
                        style={{ cursor: "pointer" }}
                        title="Update MSA"
                        onClick={() => onMSAUpdate(rowData)}
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
                <TooltipWrapper id={`clientNameTooltip-${rowData.id}`} content={rowData.client_name} />
            ),
        },
        {
            label: "Vega Client Name",
            fieldName: "vega_client_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Vega Client Name",
            body: (rowData: any) => (
                <TooltipWrapper id={`vegaClientNameTooltip-${rowData.id}`} content={rowData.vega_client_name} />
            ),
        },
        {
            label: "Client Type",
            fieldName: "client_type",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Client Type",
            body: (rowData: any) => (
                <TooltipWrapper id={`clientTypeTooltip-${rowData.id}`} content={rowData.client_type} />
            ),
        },
        {
            label: "Credit Period (No. of Days)",
            fieldName: "credit_period",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Credit Period",
            body: (rowData: any) => (
                <TooltipWrapper id={`creditPeriodTooltip-${rowData.id}`} content={rowData.credit_period} />
            ),
        },
        {
            label: "Client Status",
            fieldName: "client_status",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Client Status",
            body: (rowData: any) => (
                <TooltipWrapper id={`clientStatusTooltip-${rowData.id}`} content={rowData.client_status} />
            ),
        },
        {
            label: "Country",
            fieldName: "countryName",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Country",
            body: (rowData: any) => (
                <TooltipWrapper id={`countryTooltip-${rowData.id}`} content={rowData.countryName} />
            ),
        },
        {
            label: "Company Name",
            fieldName: "companyName",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Company Name",
            body: (rowData: any) => (
                <TooltipWrapper id={`companyNameTooltip-${rowData.id}`} content={rowData.companyName} />
            ),
        },

        {
            label: "Industry Head Name",
            fieldName: "industryHeadName",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Industry Head Name",
            body: (rowData: any) => (
                <TooltipWrapper id={`industryHeadTooltip-${rowData.id}`} content={rowData.industryHeadName} />
            ),
        },
        {
            label: "Industry Sub Group",
            fieldName: "industryGroupNames",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Industry Group Names",
            body: (rowData: any) => (
                <TooltipWrapper id={`industryGroupTooltip-${rowData.id}`} content={rowData.industryGroupNames} />
            ),
        },
        {
            label: "Industry Group",
            fieldName: "industryName",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Industry Name",
            body: (rowData: any) => (
                <TooltipWrapper id={`industryNameTooltip-${rowData.id}`} content={rowData.industryName} />
            ),
        },
        // {
        //     label: "Industry Subgroup Names",
        //     fieldName: "industrySubGroupNames",
        //     textAlign: "left",
        //     sort: true,
        //     filter: true,
        //     placeholder: "Industry Subgroup Names",
        //     body: (rowData: any) => (
        //         <TooltipWrapper id={`industrySubgroupTooltip-${rowData.id}`} content={rowData.industrySubGroupNames} />
        //     ),
        // },
        {
            label: "Account Manager Names",
            fieldName: "accountManagerNames",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Account Manager Names",
            body: (rowData: any) => (
                <TooltipWrapper id={`accountManagerTooltip-${rowData.id}`} content={rowData.accountManagerNames} />
            ),
        },
        {
            label: "MSA Start Date",
            fieldName: "msa_start_date",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "MSA Start Date",
            body: (rowData: any) => (
                <TooltipWrapper id={`msaStartTooltip-${rowData.id}`} content={new Date(rowData.msa_start_date).toLocaleDateString()} />
            ),
        },
        {
            label: "MSA End Date",
            fieldName: "msa_end_date",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "MSA End Date",
            body: (rowData: any) => (
                <TooltipWrapper id={`msaEndTooltip-${rowData.id}`} content={new Date(rowData.msa_end_date).toLocaleDateString()} />
            ),
        },
        {
            label: "MSA available?",
            fieldName: "msa_flag",
            textAlign: "left",
            frozen: false,
            sort: true,
            filter: true,
            body: (rowData: any) => (
                <div>
                    <span>
                        {rowData?.msa_flag == 1 ? "Yes" : "No"}
                    </span>
                </div>
            ),
        },
        {
            label: "MSA File",
            fieldName: "msaFilePath",
            textAlign: "left",
            sort: false,
            filter: false,
            placeholder: "MSA File",
            body: (rowData: any) => (
                <>
                    {rowData?.msaFilePath ? (
                        <div onClick={() => downloadFile(rowData.msaFilePath)} >
                            <span style={{
                                cursor: "pointer", // Pointer cursor on hover
                                color: "#007bff", // Icon color (same as text)
                            }}>MSA</span>
                            <span
                                className="pi pi-download" // Use the PrimeIcons class for download icon
                                style={{
                                    cursor: "pointer", // Pointer cursor on hover
                                    marginLeft: "8px", // Space between text and icon
                                    fontSize: "10px", // Icon size
                                    color: "#007bff", // Icon color (same as text)
                                }}
                                title="Download MSA"
                            ></span>
                        </div>

                    ) : null}
                </>),
        },
        {
            label: "NDA available?",
            fieldName: "nda_flag",
            textAlign: "left",
            frozen: false,
            sort: true,
            filter: true,
            body: (rowData: any) => (
                <div>
                    <span>
                        {rowData?.nda_flag == 1 ? "Yes" : "No"}
                    </span>
                </div>
            ),
        },
        {
            label: "NDA File",
            fieldName: "ndaFilePath",
            textAlign: "left",
            sort: false,
            filter: false,
            placeholder: "NDA File",
            body: (rowData: any) =>
            (<>
                {rowData?.ndaFilePath ? (
                    <div onClick={() => downloadFile(rowData.ndaFilePath)} >
                        <span style={{
                            cursor: "pointer", // Pointer cursor on hover
                            color: "#007bff", // Icon color (same as text)
                        }}>NDA</span>
                        <span
                            className="pi pi-download" // Use the PrimeIcons class for download icon
                            style={{
                                cursor: "pointer", // Pointer cursor on hover
                                marginLeft: "8px", // Space between text and icon
                                fontSize: "10px", // Icon size
                                color: "#007bff", // Icon color (same as text)
                            }}
                            title="Download MSA"
                        ></span>
                    </div>

                ) : null}
            </>),
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
        {
            label: "Updated At",
            fieldName: "updated_at",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Updated At",
            body: (rowData: any) => (
                <TooltipWrapper id={`updatedAtTooltip-${rowData.id}`} content={new Date(rowData.updated_at).toLocaleString()} />
            ),
        }
    ];

    const downloadFile = (filePath: any) => {
        const fileUrl = `${process.env.REACT_APP_API_BASEURL}/${filePath}`;
        // Create an anchor element and trigger the download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = filePath.split("/").pop(); // Extracts file name from the path
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const viewMSAFile = (filePath: any) => {
        const signatureUrl = `${process.env.REACT_APP_API_BASEURL}/${filePath}`;
        // Open the file in a new tab
        window.open(signatureUrl, "_blank");
    };


    const TooltipWrapper = ({ id, content }: any) => (
        <div>
            <span id={id}>{content}</span>
            <Tooltip target={`#${id}`} position="top" />
        </div>
    );



    useEffect(() => {
        const fetchData = async () => {
            await getClientMaster();
            // await getStateMaster();
            const countries = await getCountryMaster();
            await formatCountryDetails(countries);
            const companies = await getCompanyMaster();
            await formatCompanyDetails(companies);
            const industryHead = await getIndustryHeadMaster();
            await formatIndustryHeadDetails(industryHead);
            const industryGroups = await getIndustryGroupMaster();
            await formatIndustryGroupDetails(industryGroups);
            // const accountManagers = await getAccountManagerMaster();
            // await formatAccountManagerMasterDetails(accountManagers);
            // const accountMaster = await getAccountMaster();
            // await formatAccountMasterDetails(accountMaster);
            // const salesManager = await getSalesMaster();
            // await formatSalesManagerDetails(salesManager)
            // await formatAccountMasterDetails(accountMaster);
            const industries = await getIndustryMaster()
            await formatIndustry_ClientDetails(industries);
            await formatIndustrySubGroupDetails(industries)
        };
        if (clientFormPopup == false && showConfirmDialogue == false && showMsaUpdatePopup == false) {
            fetchData();
        }
    }, [clientFormPopup, showConfirmDialogue, showMsaUpdatePopup]);

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


    const getSalesMaster = async () => {
        // setLoader(true);
        try {
            const response = await salesService.getSalesMaster();
            const temp = response?.salesManagers?.filter((item: any) => item?.isactive || item?.isActive)
            setSalesMaster(temp);
            return temp;
        } catch (error) {
            console.error(error);
        } finally {
            // setLoader(false);
        }
    };

    const getIndustryMaster = async () => {
        setLoader(true);
        try {
            const response = await industryService.getIndustryMaster();
            const temp = response?.industryMasters?.filter((item: any) => item?.isactive || item?.isActive)
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
        // setLoader(true);
        try {
            const response = await accountService.getAccountMaster();
            const temp = response?.accountManagers?.filter((item: any) => item?.isactive || item?.isActive)
            setAccountManagerMaster(temp);
            return temp;
        } catch (error) {
            console.error(error);
        } finally {
            // setLoader(false);
        }
    };

    const getAccountMaster = async () => {
        // setLoader(true);
        try {
            const response = await accountsService.getAccountsMaster();
            const temp = response?.companyAccounts?.filter((item: any) => item?.isactive || item?.isActive)
            setAccountsMaster(temp);
            return temp;
        } catch (error) {
            console.error(error);
        } finally {
            // setLoader(false);
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
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientFormHandler(clientFormFieldsStructure)
    };

    const formatIndustryHeadDetails = async (
        industries: any = industryHeadMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.industryHeadName
        );
        clientFormFieldsStructure.industryHeadNames.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientFormHandler(clientFormFieldsStructure)
    };

    const formatIndustryGroupDetails = async (
        industries: any = industryGroupMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.groupIndustryName
        );
        clientFormFieldsStructure.industry_group.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientFormHandler(clientFormFieldsStructure)
    };

    const formatIndustrySubGroupDetails = async (
        industries: any = industryGroupMaster
    ) => {
        console.log('industryGroupMaster', industries);

        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.subIndustryCategory
        );
        // clientFormFieldsStructure.industry_sub_group.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientFormHandler(clientFormFieldsStructure)
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

    const formatSalesManagerDetails = async (
        industries: any = salesMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.name
        );

        clientFormFieldsStructure.sales_person.options = industryHeadList;
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
        await clientFormHandler(clientFormFieldsStructure);
    };



    const openSaveForm = async () => {
        setClientFormPopup(true);
    };

    const statesFormHandler = async (form: FormType) => {
        setClientForm(form);
    };

    const onUpdate = async (data: any) => {
        const accountManagers = await getAccountManagerMaster();
        await formatAccountManagerMasterDetails(accountManagers);
        const accountMaster = await getAccountMaster();
        await formatAccountMasterDetails(accountMaster);
        const salesManager = await getSalesMaster();
        await formatSalesManagerDetails(salesManager)
        await formatAccountMasterDetails(accountMaster);
        await setCliendData(data);
        await updateClientaster(data);
        await setClientFormPopup(true);
        await setIsEditClient(true);
    };
    const onMSAUpdate = (data: any) => {
        setShowMsaUpdatePopup(true);
        setCliendData(data);
    };

    const onPopUpClose = (e?: any) => {
        setShowConfirmDialogue(false);
    };

    const updateClientaster = (data: any) => {

        try {
            clientFormFieldsStructure.client_name.value = data?.client_name;
            clientFormFieldsStructure.vega_client_name.value = data?.vega_client_name;
            clientFormFieldsStructure.client_type.value = data?.client_type;
            clientFormFieldsStructure.credit_period.value = data?.credit_period;
            // clientFormFieldsStructure.client_status.value = data?.client_status;
            clientFormFieldsStructure.country_name.value = data?.countryName;
            clientFormFieldsStructure.companyName.value = data?.companyName;
            clientFormFieldsStructure.account_name.value = data?.bankName?.split(',');
            clientFormFieldsStructure.industryHeadNames.value = data?.industryHeadName;

            clientFormFieldsStructure.industry_name.value = data?.industryGroupNames;
            clientFormFieldsStructure.industry_group.value = data?.industryName;
            // clientFormFieldsStructure.industry_sub_group.value = data?.industrySubGroupNames;
            clientFormFieldsStructure.sales_person.value = data?.salesMangerName?.split(',');
            clientFormFieldsStructure.account_manager.value = data?.accountManagerNames?.split(',');
            clientFormFieldsStructure.msa_start_date.value = parseDateString(data?.msa_start_date);
            clientFormFieldsStructure.msa_end_date.value = parseDateString(data?.msa_end_date);
            clientFormFieldsStructure.is_msa_missing.value = data?.msa_flag ? true : false;
            clientFormFieldsStructure.nda_flag.value = data?.nda_flag ? true : false;
            clientFormFieldsStructure.non_solicitation_clause.value = data?.non_solicitation_clause_flag ? true : false;
            clientFormFieldsStructure.use_logo_permission.value = data?.use_logo_permission_flag ? true : false;
            console.log('dataaaaaaaaaa---->>>', clientFormFieldsStructure, data);
            // clientFormFieldsStructure.msaFilePath.value = data?.msaFilePath;
            // clientFormFieldsStructure.ndaFilePath.value = data?.ndaFilePath;
            // clientFormFieldsStructure.updated_by.value = data?.updated_by;
            // clientFormFieldsStructure.isActive.value = data?.isActive;
            // clientFormFieldsStructure.updated_at.value = data?.updated_at;
            if (data?.msa_flag) {
                setLogoUrl(data?.msaFilePath)
            }
            if (data?.nda_flag) {
                setSignatureUrl(data?.ndaFilePath)
            }

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

            if (!cliendData?.id) {
                stateService
                    .createStateMaster(obj)
                    .then((response: any) => {
                        if (response?.statusCode === HTTP_RESPONSE.CREATED) {
                            setCliendData({});
                            closeFormPopup();
                            ToasterService.show(response?.message, CONSTANTS.SUCCESS);
                        }
                    })
                    .catch((error: any) => {
                        setCliendData({});
                        ToasterService.show(error, CONSTANTS.ERROR);
                    });
            } else {
                const updatePayload = { ...obj, stateId: cliendData?.id };

                stateService
                    .updateStateMaster(updatePayload)
                    .then((response: any) => {
                        if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
                            setCliendData({});
                            closeFormPopup();
                            ToasterService.show(response?.message, CONSTANTS.SUCCESS);
                        }
                    })
                    .catch((error: any) => {
                        setCliendData({});
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
            askForDeactivationDate: data?.isactive || data?.is_active || data?.isActive,
        });
        setShowConfirmDialogue(true);
    };

    const confirmDelete = (deactivationDate?: Date) => {
        setLoader(true);
        console.log('deactivationDate', deactivationDate);

        clientService
            .deactivateClientMaster({ ...patchData, loggedInUserId, deactivationDate: deactivationDate ? formatDate(deactivationDate) : null, })
            .then(() => {
                setLoader(false);
                setShowConfirmDialogue(false);
                ToasterService.show(
                    `Client record ${patchData?.isActive ? "deactivated" : "activated"
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
        setIsEditClient(false);
        setCliendData({});
        setClientFormFieldsStructure(_.cloneDeep(clientFormFields));
        setClientForm(_.cloneDeep(clientFormFields));
        setShowMsaUpdatePopup(false);
        setMsaForm(_.cloneDeep(msaFormFields));
        setAttachments([]);
        setDigitalSign([]);
        setSignatureUrl('');
        setLogoUrl('')
    };

    const parseDateString = (dateString: any) => {
        if (!dateString) return new Date();
        const date: any = new Date(dateString);
        if (isNaN(date)) return new Date();
        const year = date.getFullYear();
        const month: any = String(date.getMonth() + 1).padStart(2, "0");
        const day: any = String(date.getDate()).padStart(2, "0");
        return new Date(year, month - 1, day);
    };

    const formatDate = (dateString: any) => {
        if(!dateString)return null;
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
                        setLogoUrl(fileURL)
                    }
                } else {
                    ToasterService.show(
                        `Invalid file format you can only attach the PDF here!`,
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
                    FILE_TYPES.PDF
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
                        `Invalid file format you can only attach the PDF here!`,
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
        // const selectedCompany = companyMaster?.find(
        //     (item: any) => item?.companyName == form?.companyName?.value
        // );
        // const selectedCountry = countryMaster?.find(
        //     (item: any) => item?.name == selectedCompany?.countryName
        // );
        if (form.nda_flag.value == true) {
            setShowNDAAttacment(true);
        } else if (form.nda_flag.value == false) {
            setShowNDAAttacment(false);
        }
        console.log('hhhhh', form);

        if (form?.is_same_alias?.value == true) {
            form.vega_client_name.value = form?.client_name?.value;
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

        // console.log('form handler checking ---->>> ', form, clientForm);

        if (form.companyName?.value !== clientForm?.companyName?.value) {
            const selectedCompany = form.companyName?.value
            if (selectedCompany) {
                const accountMaster = await getAccountMaster();
                if (accountMaster) {
                    const tempData = accountMaster?.filter((item: any) => item?.companyName == selectedCompany).map((ele: any) => ele?.bankName);
                    form.account_name.options = tempData || [];

                    const defaultAccount = [accountMaster?.filter((item: any) => item?.companyName == selectedCompany)?.find((ele: any) => ele?.isDefaultAccount)?.bankName];
                    form.account_name.value = defaultAccount.includes(undefined) ? [] : defaultAccount;

                    console.log('form handler checking ---->>> ', defaultAccount);

                }
            }
        }
        if (form.industryHeadNames?.value !== clientForm?.industryHeadNames?.value) {
            const selectedIndustryHead = form.industryHeadNames?.value
            if (selectedIndustryHead) {
                const accountManagers = await getAccountManagerMaster();
                const salesManager = await getSalesMaster();

                if (accountManagers) {
                    const tempData = accountManagers?.filter((item: any) => item?.industryHeadNames == selectedIndustryHead).map((ele: any) => ele?.name);
                    form.account_manager.options = tempData || [];
                }
                if (salesManager) {
                    const tempData = salesManager?.filter((item: any) => item?.industryHeadNames == selectedIndustryHead).map((ele: any) => ele?.name);
                    form.sales_person.options = tempData || [];
                }
                if (industryGroupMaster) {
                    const selectedIndustry = industryHeadMaster
                        ?.find((item: any) => item?.industryHeadName === selectedIndustryHead)
                        ?.industryNames;

                    const selectedIndustryArray = selectedIndustry?.split(',').map((str: string) => str.trim()); // Split and trim the selected industries

                    const tempData = industryGroupMaster
                        ?.filter((item: any) =>
                            selectedIndustryArray?.some((industry: string) => item?.groupIndustryName.includes(industry))
                        )
                        .map((ele: any) => ele?.groupIndustryName);

                    form.industry_group.options = tempData || [];
                    console.log('Filtered tempData:', tempData, 'Selected Industries:', selectedIndustryArray);
                }
            }
        }

        setClientForm(form);
    };

    const msaFormHandler = async (currentForm: FormType) => {
        const form = _.cloneDeep(currentForm);
        setMsaForm(form);
    };

    const createNewClient = async (event: FormEvent) => {
        event.preventDefault();
        let companyValidityFlag = true;
        const companyFormValid: boolean[] = [];


        _.each(clientForm, (item: any) => {
            if (item?.validation?.required) {
                // companyFormValid.push(item.value);
                companyValidityFlag = companyValidityFlag && item.value; // Ensure boolean value
            }
        });


        setIsFormValid(companyValidityFlag);
        console.log('clientForm', clientForm, clientForm?.account_manager?.value?.length , clientForm?.sales_person
            ?.value?.length);

        if (!clientForm?.account_manager?.value?.length && !clientForm?.sales_person
            ?.value?.length) {
            ToasterService.show(
                `Account Manager or Sales Mnager is mandatory`,
                "error"
            );
            return;
        }

        if (companyValidityFlag) {
            const industry_id =
                industryMaster.find(
                    (industry: any) =>
                        industry.industryName === clientForm.industry_name.value
                )?.id ?? null;
            console.log('createClientForm : ', countryMaster, clientForm);

            const countryId =
                countryMaster.find(
                    (el: any) =>
                        el.name === clientForm.country_name.value
                )?.id ?? null;

            let companyId =
                // clientForm?.companyName?.value?.forEach((item: any) => {
                //     const id =
                //         companyMaster?.find(
                //             (com: any) => com?.companyName == item
                //         )?.id ?? null;
                //     if (id != null) {
                //         companyId =
                //             companyId != "" ? companyId + "," + id : id;
                //     }
                // });
                companyMaster.find(
                    (el: any) =>
                        el.companyName === clientForm.companyName.value
                )?.id ?? null;

            let bankId = clientForm?.account_name?.value
                ?.map((item: any) =>
                    accountsMaster?.find((com: any) => com?.bankName === item)?.id
                )
                .filter((id: any) => id !== undefined && id !== null)
                .join(",");

            const IndustryHeadId =
                industryHeadMaster.find(
                    (el: any) =>
                        el.industryHeadName === clientForm.industryHeadNames.value
                )?.id ?? null;

            console.log('dddddddddddd', industryGroupMaster, clientForm);
            const IndustryGroupId =
                industryGroupMaster.find(
                    (el: any) =>
                        el.groupIndustryName === clientForm.industry_group.value
                )?.id ?? null;


            // const IndustrySubGroupId =
            //     industryMaster.find(
            //         (el: any) =>
            //             el.subIndustryCategory === clientForm.industry_sub_group.value
            //     )?.id ?? null;

            let accountManagerId = "";
            clientForm?.account_manager?.value?.forEach((item: any) => {
                const id =
                    accountManagerMaster?.find(
                        (com: any) => com?.name == item
                    )?.id ?? null;
                if (id != null) {
                    accountManagerId =
                        accountManagerId != "" ? accountManagerId + "," + id : id;
                }
            });

            let salesManagerId = "";
            clientForm?.sales_person?.value?.forEach((item: any) => {
                const id =
                    salesMaster?.find(
                        (com: any) => com?.name == item
                    )?.id ?? null;
                if (id != null) {
                    salesManagerId =
                        salesManagerId != "" ? salesManagerId + "," + id : id;
                }
            });


            const formData: any = new FormData();

            const obj = {
                client_name: clientForm?.client_name?.value,
                vega_client_name: clientForm?.vega_client_name?.value,
                client_type: clientForm?.client_type?.value,
                credit_period: clientForm?.credit_period?.value,
                client_status: 1,
                countryId: countryId,
                companyId: companyId,
                accountId: bankId,
                industryId: industry_id ? industry_id : null,
                IndustryHeadId: IndustryHeadId,
                IndustryGroupId: IndustryGroupId,
                // IndustrySubGroupId: IndustrySubGroupId,
                salesMangerId: salesManagerId,
                accountManagerId: accountManagerId,
                msa_start_date: formatDate(clientForm?.msa_start_date?.value),
                msa_end_date: formatDate(clientForm?.msa_end_date?.value),
                msa_flag: clientForm?.is_msa_missing?.value ? 1 : 0,
                nda_flag: clientForm?.nda_flag?.value ? 1 : 0,
                non_solicitation_clause_flag: clientForm?.non_solicitation_clause?.value ? 1 : 0,
                use_logo_permission_flag: clientForm?.use_logo_permission?.value ? 1 : 0,
                updated_by: loggedInUserId,
                isActive: 1
            };


            Object.entries(obj).forEach(([key, value]: any) => {
                formData.set(key, value);
            });


            // Check for msaFile and ndaFile requirements
            if (clientForm?.is_msa_missing?.value && (!attachments || !attachments.length)) {
                ToasterService.show("MSA file is required!", CONSTANTS.ERROR);
                return;
            } else if (attachments?.length) {
                formData.set("msaFile", attachments[0]);
            }

            if (clientForm?.nda_flag?.value && (!digitalSign || !digitalSign.length)) {
                ToasterService.show("NDA file is required!", CONSTANTS.ERROR);
                return;
            } else if (digitalSign?.length) {
                formData.set("ndaFile", digitalSign[0]);
            }

            // if (attachments?.length) {
            //     formData.set("msaFile", attachments[0]);
            // }

            // if (digitalSign?.length) {
            //     formData.set("ndaFile", digitalSign[0]);
            // }
            console.log("here formData", formData);

            console.log('createClientForm : ', clientForm, obj);


            if (!cliendData?.id) {
                clientService
                    .createClientMaster(formData)
                    .then((response: any) => {
                        if (response?.statusCode === HTTP_RESPONSE.CREATED) {
                            setCliendData({});
                            closeFormPopup();
                            ToasterService.show(response?.message, CONSTANTS.SUCCESS);
                        }
                    })
                    .catch((error: any) => {
                        setCliendData({});
                        ToasterService.show(error, CONSTANTS.ERROR);
                    });
            } else {
                const formData: any = new FormData();

                const updatePayload = { ...obj, clientId: cliendData?.id };

                Object.entries(updatePayload).forEach(([key, value]: any) => {
                    formData.set(key, value);
                });

                if (attachments?.length) {
                    formData.set("msaFile", attachments[0]);
                }

                if (digitalSign?.length) {
                    formData.set("ndaFile", digitalSign[0]);
                }

                clientService
                    .updateClientMaster(formData)
                    .then((response: any) => {
                        if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
                            setCliendData({});
                            closeFormPopup();
                            ToasterService.show(response?.message, CONSTANTS.SUCCESS);
                        }
                    })
                    .catch((error: any) => {
                        setCliendData({});
                        ToasterService.show(error, CONSTANTS.ERROR);
                    });
            }
        } else {
            ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
        }
    };


    const updateCurrentMSA = async (event: FormEvent) => {
        event.preventDefault();
        let companyValidityFlag = true;
        const companyFormValid: boolean[] = [];

        _.each(msaForm, (item: any) => {
            if (item?.validation?.required) {
                // companyFormValid.push(item.valid);
                companyValidityFlag = companyValidityFlag && item.value;
            }
        });

        setIsFormValid(companyValidityFlag);

        if (companyValidityFlag) {

            const formData: any = new FormData();

            const obj = {
                clientId: cliendData?.id,
                start_date: formatDate(msaForm?.start_date?.value),
                end_date: formatDate(msaForm?.end_date?.value),
                updated_by: loggedInUserId,
            };


            Object.entries(obj).forEach(([key, value]: any) => {
                formData.set(key, value);
            });


            if (attachments?.length) {
                formData.set("msaFile", attachments[0]);
            }
            console.log('createClientForm : ', clientForm, obj);

            clientService
                .updateMSAFile(formData)
                .then((response: any) => {
                    if (response?.statusCode === HTTP_RESPONSE.CREATED) {
                        setCliendData({});
                        closeFormPopup();
                        ToasterService.show(response?.message, CONSTANTS.SUCCESS);
                    }
                })
                .catch((error: any) => {
                    setCliendData({});
                    ToasterService.show(error, CONSTANTS.ERROR);
                });

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
                    downloadedfileName={"Client"}
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
                                <h4 className="popup-heading">{isEditClient ? 'Update' : 'Add New'} Client</h4>
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
                                                                {/* <img src={logoUrl} style={{ width: '200px', height: '130px' }} alt="Preview" /> */}
                                                                <img src={ImageUrl.PdfIcon} style={{ width: '200px', height: '130px' }} alt="Preview" />
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
                                                                <img src={ImageUrl.PdfIcon} style={{ width: '200px', height: '130px' }} alt="Preview" />
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
                                                                    <u>Support PDF</u>
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
            {showMsaUpdatePopup ? (
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
                                <h4 className="popup-heading">Update MSA</h4>
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
                                form={_.cloneDeep(msaForm)}
                                formUpdateEvent={msaFormHandler}
                                isFormValidFlag={isFormValid}
                            ></FormComponent>

                            {/* attachment */}
                            <div className="row">
                                <div className="col-md-12">
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
                                                                {/* <img src={logoUrl} style={{ width: '200px', height: '130px' }} alt="Preview" /> */}
                                                                <img src={ImageUrl.PdfIcon} style={{ width: '200px', height: '130px' }} alt="Preview" />
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
                                </div>
                            </div>
                            {/* attachment */}
                        </div>

                        <div className="popup-lower-btn">
                            <ButtonComponent
                                label="Submit"
                                icon="pi pi-check"
                                iconPos="right"
                                submitEvent={updateCurrentMSA}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ClientMaster;

