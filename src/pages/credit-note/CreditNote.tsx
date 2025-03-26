import React, { FormEvent, useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ui/button/Button";
import DataTableBasicDemo from "../../components/ui/table/Table";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";
import FormComponent from "../../components/ui/form/form";
import classes from "../client/Client.module.scss";
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
import { PoContractService } from "../../services/po-contract/poContract.service";
import { TaxMasterService } from "../../services/masters/tax-service-master/taxMaster.service";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import moment from "moment";
import { InvoiceService } from "../../services/invoice/invoice.service";
import { CreditNoteService } from "../../services/credit-note/credit-note.service";

const CreditNoteMaster = () => {

    const clientFormFields: any = {
        client_name: {
            inputType: "singleSelect",
            label: "Client",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        contract_name: {
            inputType: "singleSelect",
            label: "Contract",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },

        po_number: {
            inputType: "inputtext",
            label: "PO Number",
            value: null,
            disable: true,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        po_amount: {
            inputType: "inputtext",
            label: "PO Amount",
            value: null,
            disable: true,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        remain_po_amount: {
            inputType: "inputtext",
            label: "Remain PO Amount",
            value: null,
            disable: true,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        invoice_date: {
            inputType: "singleDatePicker",
            label: "Credit Date",
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        clientBillTo: {
            inputType: "multiSelect",
            label: "Client Bill Address",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        clientShipAddress: {
            inputType: "multiSelect",
            label: "Client Ship Address",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        clientContact: {
            inputType: "singleSelect",
            label: "Contact",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        company_name: {
            inputType: "inputtext",
            label: "Company Name",
            value: null,
            disable: true,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        bill_from: {
            inputType: "singleSelect",
            label: "Bill From",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        projectService: {
            inputType: "singleSelect",
            label: "Service Type",
            options: [],
            value: null,
            validation: {
                required: true
            },
            fieldWidth: "col-md-4",
        },
        tax_type: {
            inputType: "singleSelect",
            label: "Tax Type",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        tax_code: {
            inputType: "multiSelect",
            label: "Tax Code",
            options: [],
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        invoice_amount: {
            inputType: "inputtext",
            label: "Credit Amount",
            value: null,
            validation: { required: true },
            fieldWidth: "col-md-4",
        },
        note_one: {
            inputType: "inputtextarea",
            label: "Note 1",
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-6",
            rows: 3,
        },
        note_two: {
            inputType: "inputtextarea",
            label: "Note 2",
            value: null,
            validation: {
                required: false,
            },
            fieldWidth: "col-md-6",
            rows: 3,
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


    const [poContractsData, setPoContractData] = useState<any>([]);
    const [clientListNames, setClientListNames] = useState<any>([]);
    const [poContractConfData, setPoContractConfData] = useState<any>([]);
    const [taxMaster, setTaxMaster] = useState<any>([]);
    const [companyLocationMaster, setCompanyLocationMaster] = useState<any>([]);
    const [invoiceMasterData, setInvoiceMasterData] = useState<any>([]);
    const [poMastersConfigData, setPoMastersConfigData] = useState<any>({});
    const [invoiceItems, setInvoiceItems] = useState<any>([{ id: Date.now(), description: "", sacCode: "", amount: 0 }]);
    const [selectedTaxes, setSelectedTaxes] = useState<any>([])
    const [selectedApplicableTaxes, setSelectedApplicableTaxes] = useState<any>([])


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
    const invoiceService = new InvoiceService();
    const accountService = new AccountMasterService();
    const accountsService = new AccountsMasterService();
    const creditNoteService = new CreditNoteService();

    const cookies = new Cookies();
    const userInfo = cookies.get("userInfo");

    const loggedInUserId = userInfo?.userId;
    let patchData: any;
    const countryService = new CountryMasterService();
    const stateService = new StateMasterService();
    const industryService = new IndustryMasterService();
    const salesService = new SalesMasterService();

    const poContractService = new PoContractService();
    const taxService = new TaxMasterService();

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
                        className={`pi pi-ellipsis-v`}
                        style={{ cursor: "pointer" }}
                        title="Generate PDF"
                    //   onClick={() => onDelete(rowData)}
                    ></span>
                </div>
            ),
        },
        {
            label: "Credit Note Name",
            fieldName: "invoice_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Credit Name",
            body: (rowData: any) => (
                <TooltipWrapper id={`clientTooltip-${rowData.id}`} content={rowData.invoice_name} />
            ),
        },
        {
            label: "Client",
            fieldName: "client_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Client",
            body: (rowData: any) => (
                <TooltipWrapper id={`clientTooltip-${rowData.id}`} content={rowData.client_name} />
            ),
        },
        {
            label: "Contract",
            fieldName: "contract_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Contract",
            body: (rowData: any) => (
                <TooltipWrapper id={`contractTooltip-${rowData.id}`} content={rowData.contract_name} />
            ),
        },
        {
            label: "PO Number",
            fieldName: "po_number",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "PO Number",
            body: (rowData: any) => (
                <TooltipWrapper id={`poNumberTooltip-${rowData.id}`} content={rowData.po_number} />
            ),
        },
        {
            label: "PO Amount",
            fieldName: "po_amount",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "PO Amount",
            body: (rowData: any) => (
                <TooltipWrapper id={`poAmountTooltip-${rowData.id}`} content={rowData.po_amount} />
            ),
        },
        {
            label: "Remain PO Amount",
            fieldName: "remain_po_amount",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Remain PO Amount",
            body: (rowData: any) => (
                <TooltipWrapper id={`remainPoAmountTooltip-${rowData.id}`} content={rowData.remain_po_amount} />
            ),
        },
        {
            label: "Credit Date",
            fieldName: "invoice_date",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Credit Date",
            body: (rowData: any) => (
                <TooltipWrapper id={`invoiceDateTooltip-${rowData.id}`} content={new Date(rowData.invoice_date).toLocaleDateString()} />
            ),
        },
        {
            label: "Bill To",
            fieldName: "clientBillTo",
            textAlign: "left",
            frozen: false,
            sort: true,
            filter: true,
            body: (rowData: any) => <span>{rowData?.clientBillTo_name}</span>,
        },
        {
            label: "Shipping Address",
            fieldName: "clientShipAddress",
            textAlign: "left",
            frozen: false,
            sort: true,
            filter: true,
            body: (rowData: any) => <span>{rowData?.clientShipAddress_name}</span>,
        },
        {
            label: "Contact",
            fieldName: "client_contact",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Contact",
            body: (rowData: any) => (
                <TooltipWrapper id={`clientContactTooltip-${rowData.id}`} content={rowData.clientContact_name} />
            ),
        },
        {
            label: "Bill From",
            fieldName: "bill_from",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Bill From",
            body: (rowData: any) => (
                <TooltipWrapper id={`billFromTooltip-${rowData.id}`} content={rowData.bill_from} />
            ),
        },
        {
            label: "Project Service",
            fieldName: "projectService",
            textAlign: "left",
            frozen: false,
            sort: true,
            filter: true,
            body: (rowData: any) => <span>{rowData?.projectService_names}</span>,
        },
        {
            label: "Tax Code",
            fieldName: "tax_code",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Tax Code",
            body: (rowData: any) => (
                <TooltipWrapper id={`taxCodeTooltip-${rowData.id}`} content={rowData.tax_code} />
            ),
        },
        {
            label: "Credit Amount",
            fieldName: "invoice_amount",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Credit Amount",
            body: (rowData: any) => (
                <TooltipWrapper id={`invoiceAmountTooltip-${rowData.id}`} content={rowData.invoice_amount} />
            ),
        },
        {
            label: "Total Amount",
            fieldName: "total_amount",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Total Amount",
            body: (rowData: any) => (
                <TooltipWrapper id={`invoiceAmountTooltip-${rowData.id}`} content={rowData.total_amount} />
            ),
        },
        {
            label: "GST Total",
            fieldName: "gst_total",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "GST Total",
            body: (rowData: any) => (
                <TooltipWrapper id={`invoiceAmountTooltip-${rowData.id}`} content={rowData.gst_total} />
            ),
        },
        {
            label: "Final Amount",
            fieldName: "final_amount",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Final Amount",
            body: (rowData: any) => (
                <TooltipWrapper id={`invoiceAmountTooltip-${rowData.id}`} content={rowData.final_amount} />
            ),
        },
        {
            label: "Note 1",
            fieldName: "note_one",
            textAlign: "left",
            sort: false,
            filter: true,
            placeholder: "Note 1",
            body: (rowData: any) => (
                <TooltipWrapper id={`noteOneTooltip-${rowData.id}`} content={rowData.note_one} />
            ),
        },
        {
            label: "Note 2",
            fieldName: "note_two",
            textAlign: "left",
            sort: false,
            filter: true,
            placeholder: "Note 2",
            body: (rowData: any) => (
                <TooltipWrapper id={`noteTwoTooltip-${rowData.id}`} content={rowData.note_two} />
            ),
        },
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
            getInvoiceData()
            getContractMaster();
            getPoContractConfiguration();
            getTaxMaster();
            getCompanyLocationMaster();
            getPOContractMasterConfigData();
        };
        if (clientFormPopup == false && showConfirmDialogue == false) {
            fetchData();
        }
    }, [clientFormPopup, showConfirmDialogue]);


    const getInvoiceData = async () => {
        setLoader(true);
        try {
            const response = await creditNoteService.getCreditNoteData();
            response.invoices.forEach((item: any) => item.invoiceInfo = JSON.parse(item.invoiceInfo))

            const parsedData = response.invoices.map((invoice: any) => ({
                ...invoice,
                invoiceInfo: invoice.invoiceInfo.map((info: any) => ({
                    ...info,
                    taxBreakdown: info.taxBreakdown ? JSON.parse(info.taxBreakdown) : []
                }))
            }));
            setInvoiceMasterData(parsedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };
    const getContractMaster = async () => {
        // setLoader(true);
        try {
            const response = await poContractService.getPoContractsData();

            setPoContractData(response?.poContracts);
        } catch (error) {
            console.error(error);
        } finally {
            // setLoader(false);
        }
    };
    const getPoContractConfiguration = async () => {
        // setLoader(true);
        try {
            const response = await poContractService.getPoContractConfiguration();
            setPoContractConfData(response?.data);
            setClientListNames(response?.data?.map((item: any) => {
                return item.client_name
            }))
            return response?.data
        } catch (error) {
            console.error(error);
        } finally {
            // setLoader(false);
        }
    };

    const getPOContractMasterConfigData = async () => {
        setLoader(true);
        try {
            const response = await poContractService.getPOContractMasterConfigData();
            setPoMastersConfigData(response?.data?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    const getTaxMaster = async () => {
        // setLoader(true);
        try {
            const response = await taxService.getTax();
            if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
                console.log('getTaxMaster ', response.data);
                setTaxMaster(response.data);
                closeFormPopup();
            }
        } catch (error: any) {
            ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
        }
    };

    const getCompanyLocationMaster = async () => {
        // setLoader(true);
        try {
            const response = await companyService.getCompanyLocationMaster();
            console.log('setCompanyLocationMaster', response?.locations);

            setCompanyLocationMaster(response?.locations);
            return response?.locations;
        } catch (error) {
            console.error(error);
        } finally {
            // setLoader(false);
        }
    };

    const formatTaxDetails = async (tax: any = taxMaster) => {
        const taxDetails = tax.map((item: any) => item?.taxType);
        clientFormFieldsStructure.tax_type.options = taxDetails;
        console.log('clientFormFieldsStructure', tax, taxDetails);

        await setClientFormFieldsStructure(clientFormFieldsStructure);
        // await statesFormHandler(clientFormFieldsStructure);
    };


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
        // clientFormFieldsStructure.country_name.options = countrylist;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await statesFormHandler(clientFormFieldsStructure);
    };

    const formatCompanyDetails = async (companies: any = companyMaster) => {
        const companyList = companies.map((company: any) => company?.companyName);
        // clientFormFieldsStructure.companyName.options = companyList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientFormHandler(clientFormFieldsStructure)
    };

    const formatIndustryHeadDetails = async (
        industries: any = industryHeadMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.industryHeadName
        );
        // clientFormFieldsStructure.industryHeadNames.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientFormHandler(clientFormFieldsStructure)
    };

    const formatIndustryGroupDetails = async (
        industries: any = industryGroupMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.groupIndustryName
        );
        // clientFormFieldsStructure.industry_group.options = industryHeadList;
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
        // clientFormFieldsStructure.account_manager.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatSalesManagerDetails = async (
        industries: any = salesMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.name
        );

        // clientFormFieldsStructure.sales_person.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatAccountMasterDetails = async (
        industries: any = accountsMaster
    ) => {
        const industryHeadList = industries.map(
            (industryHead: any) => industryHead?.bankName
        );
        // clientFormFieldsStructure.account_name.options = industryHeadList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
    };

    const formatIndustry_ClientDetails = async (industries: any = industryMaster) => {
        const industryList = industries.map(
            (industry: any) => industry?.industryName
        );
        // clientFormFieldsStructure.industry_name.options = industryList;
        await setClientFormFieldsStructure(clientFormFieldsStructure);
        await clientFormHandler(clientFormFieldsStructure);
    };



    const openSaveForm = async () => {
        clientForm.client_name.options = clientListNames;
        clientForm.projectService.options = Array.isArray(poMastersConfigData?.projectService)
            ? poMastersConfigData?.projectService.map((item: any) => ({
                label: item?.name,
                value: item.id.toString(),
            }))
            : [];

        const taxDetails = taxMaster.map((item: any) => item?.taxType);
        clientForm.tax_type.options = taxDetails;
        setClientFormPopup(true);
    };

    const statesFormHandler = async (form: FormType) => {
        setClientForm(form);
    };

    const onUpdate = async (data: any) => {
        await getContractMaster();
        await getPoContractConfiguration();
        await getTaxMaster();
        await getCompanyLocationMaster();
        await setCliendData(data);
        await updateClientMaster(data);
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

    const updateClientMaster = (data: any) => {
        try {
            clientFormFieldsStructure.client_name.options = clientListNames;
            clientFormFieldsStructure.client_name.disable = true;
            clientFormFieldsStructure.client_name.options = clientListNames;
            const taxDetails = taxMaster.map((item: any) => item?.taxType);
            clientFormFieldsStructure.tax_type.options = taxDetails;

            const configData = poContractConfData.find((item: any) => item.client_name == data?.client_name)
            if (configData) {
                clientFormFieldsStructure.clientBillTo.options = configData.clientBill?.filter((item: any) => item.id).map((item: any, index: number) => {
                    return {
                        label: concatAddresses(item.address1, item.address2, item.address3),
                        value: item.id.toString(),
                        isDefault: index == 0 ? 1 : 0
                    }
                })
                console.log('Updating client form fields:', clientFormFieldsStructure, data);

                clientFormFieldsStructure.clientBillTo.value = typeof data?.clientBillTo === "string"
                    ? data.clientBillTo.split(",").map((item: any) => item.trim())
                    : [];

                clientFormFieldsStructure.clientShipAddress.options = configData.clientShip?.filter((item: any) => item.id).map((item: any, index: number) => {
                    return {
                        label: concatAddresses(item.address1, item.address2, item.address3),
                        value: item.id.toString(),
                        isDefault: index == 0 ? 1 : 0
                    }
                })
                clientFormFieldsStructure.clientShipAddress.value = typeof data?.clientShipAddress === "string"
                    ? data.clientShipAddress.split(",").map((item: any) => item.trim())
                    : [];
                clientFormFieldsStructure.clientContact.options = Array.isArray(configData?.contacts) ? configData.contacts?.filter((item: any) => item.id).map((item: any, index: number) => {
                    return {
                        label: item.name,
                        value: item.id.toString(),
                        isDefault: index == 0 ? 1 : 0
                    }
                }) : []

                clientFormFieldsStructure.clientContact.value = data?.clientContact ? data?.clientContact : [];
                clientFormFieldsStructure.company_name.value = configData?.companyInfo.companyName;
            }

            const tempData: any = companyLocationMaster?.filter((item: any) => item?.companyName == clientFormFieldsStructure.company_name.value).map((ele: any) => {
                return {
                    label: concatAddresses(ele?.address1, ele?.address2, ele?.address3),
                    isDefault: ele?.isDefaultAddress
                }
            });


            clientFormFieldsStructure.projectService.options = Array.isArray(poMastersConfigData?.projectService)
                ? poMastersConfigData?.projectService.map((item: any) => ({
                    label: item?.name,
                    value: item.id.toString(),
                }))
                : [];

            clientFormFieldsStructure.bill_from.options = tempData?.map((ele: any) => ele?.label) || [];
            clientFormFieldsStructure.bill_from.value = data?.bill_from ? data?.bill_from : "";

            clientFormFieldsStructure.client_name.value = data?.client_name || "";
            clientFormFieldsStructure.contract_name.value = data?.contract_name || "";
            clientFormFieldsStructure.po_number.value = data?.po_number || "";
            clientFormFieldsStructure.po_amount.value = data?.po_amount || "";
            clientFormFieldsStructure.remain_po_amount.value = data?.remain_po_amount || "";
            clientFormFieldsStructure.invoice_date.value = data?.invoice_date ? parseDateString(data?.invoice_date) : null;
            // clientFormFieldsStructure.contract_type.value = data?.contract_type || "";
            clientFormFieldsStructure.tax_type.value = data?.tax_type || "";
            clientFormFieldsStructure.tax_code.value = data?.tax_code ? data?.tax_code.split(",") : [];
            clientFormFieldsStructure.invoice_amount.value = data?.invoice_amount || "";
            clientFormFieldsStructure.note_one.value = data?.note_one || "";
            clientFormFieldsStructure.note_two.value = data?.note_two || "";
            clientFormFieldsStructure.projectService.value = data?.projectService ? data?.projectService : "";


            // clientFormFieldsStructure.po_number.disable = true;
            // clientFormFieldsStructure.po_amount.disable = true;
            clientFormFieldsStructure.invoice_amount.disable = true;
            clientFormFieldsStructure.contract_name.disable = true;

            setClientForm(_.cloneDeep(clientFormFieldsStructure));

            setInvoiceItems(data.invoiceInfo.map((item: any) => ({
                description: item.description,
                sacCode: item.sacCode,
                amount: item.amount,
                taxBreakdown: item.taxBreakdown
            })));

            setSelectedTaxes(data.invoiceInfo.flatMap((item: any) => item.taxBreakdown));

            console.log("Updated form data:", clientFormFieldsStructure);
        } catch (error) {
            console.error("Error updating client master form:", error);
        }
    };

    const patchInvoiceData = (data: any) => {
        if (Array.isArray(data)) {
            setInvoiceItems(data.map((item) => ({
                id: item.id || Date.now(),
                description: item.description || "",
                sacCode: item.sacCode || "",
                amount: item.amount || 0
            })));
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
        setLogoUrl('');
        setInvoiceItems([{ id: Date.now(), description: "", sacCode: "", amount: 0 }])
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
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}/${month}/${year}`;
    };

    function concatAddresses(address1: string, address2: string, address3: string) {
        // Check for null/undefined values and join non-empty addresses
        return [address1, address2, address3].filter((addr) => addr).join(", ");
    }

    const filterTaxes = (taxMaster: any, taxTypes: any) => {
        return taxMaster.filter((tax: any) => taxTypes.includes(tax.taxFieldName));
    };

    const clientFormHandler = async (currentForm: FormType) => {
        const form = _.cloneDeep(currentForm);


        console.log('form handler checking ---->>> ', form);

        // if (form.client_name?.value !== clientForm?.client_name?.value) {
        const selectedClient = form.client_name?.value
        if (selectedClient) {
            const tempData = poContractsData
                ?.filter((item: any) => item?.client_name === selectedClient)
                .map((ele: any) => ele?.po_name)
                .filter((name: any) => name !== null && name !== undefined); // Remove null/undefined values

            form.contract_name.options = tempData || [];
        }
        if ((form.contract_name?.value != clientForm?.contract_name?.value) && form.contract_name?.value) {
            const selectedContract = poContractsData?.filter((item: any) => item?.client_name === selectedClient)?.find((ele: any) => ele?.po_name == form.contract_name?.value)
            form.po_number.value = selectedContract?.poNumber;
            form.po_amount.value = selectedContract?.poAmount;
            form.remain_po_amount.value = selectedContract?.dueAmount;
            form.company_name.value = selectedContract?.companyName;

            const configData = poContractConfData.find((item: any) => item.client_name == form.client_name.value)
            console.log('configData', configData, selectedContract, form.company_name.value);

            if (configData) {
                form.clientBillTo.options = configData.clientBill?.filter((item: any) => item.id).map((item: any, index: number) => {
                    return {
                        label: concatAddresses(item.address1, item.address2, item.address3),
                        value: item.id.toString(),
                        isDefault: concatAddresses(item.address1, item.address2, item.address3) == selectedContract?.masterNames?.clientBillTo_names ? 1 : 0
                    }
                })
                const defaultBillItem = form.clientBillTo.options?.find((ele: any) => ele.isDefault == 1);
                if (defaultBillItem && defaultBillItem?.value) {
                    form.clientBillTo.value = [defaultBillItem?.value.toString()];
                }
                else {
                    form.clientBillTo.value = null;
                }
                form.clientShipAddress.options = configData.clientShip?.filter((item: any) => item.id).map((item: any, index: number) => {
                    return {
                        label: concatAddresses(item.address1, item.address2, item.address3),
                        value: item.id.toString(),
                        isDefault: concatAddresses(item.address1, item.address2, item.address3) == selectedContract?.masterNames?.clientShipAddress_names ? 1 : 0
                    }
                })
                const defaultShipItem = form.clientShipAddress?.options?.find((ele: any) => ele.isDefault == 1);
                if (defaultShipItem && defaultShipItem?.value) {
                    form.clientShipAddress.value = [defaultShipItem?.value.toString()];
                }
                else {
                    form.clientShipAddress.value = null;
                }
                form.clientContact.options = Array.isArray(configData?.contacts) ? configData.contacts?.filter((item: any) => item.id).map((item: any, index: number) => {
                    return {
                        label: item.name,
                        value: item.id.toString(),
                        isDefault: index == 0 ? 1 : 0
                    }
                }) : []
                const defaultContact = form.clientContact?.options?.find((ele: any) => ele.isDefault == 1);
                if (defaultContact && defaultContact?.value) {
                    form.clientContact.value = [defaultContact?.value.toString()];
                }
                else {
                    form.clientContact.value = null;
                }

                if (form.company_name.value) {
                    const tempData: any = companyLocationMaster?.filter((item: any) => item?.companyName == form.company_name.value).map((ele: any) => {
                        return {
                            label: concatAddresses(ele?.address1, ele?.address2, ele?.address3),
                            isDefault: ele?.isDefaultAddress
                        }
                    });
                    console.log('tempData', tempData?.map((ele: any) => ele?.label), tempData?.find((ele: any) => ele?.isDefault));

                    form.bill_from.options = tempData?.map((ele: any) => ele?.label) || [];
                    form.bill_from.value = tempData?.find((ele: any) => ele?.isDefault)?.label;
                }
            }

        }

        if (form?.tax_type?.value) {
            const taxCodeOptions = taxMaster?.filter((tax: any) => tax?.taxType == form?.tax_type?.value)?.map((item: any) => item?.taxFieldName);
            form.tax_code.options = taxCodeOptions;
        }

        if (form?.tax_code?.value) {
            const tempSelectedTaxes = filterTaxes(taxMaster, form?.tax_code?.value);
            setSelectedTaxes(tempSelectedTaxes)
        }

        // }

        setClientForm(form);
    };

    const getNamesFromOptions = (field: any) => {
        if (!field?.options || !Array.isArray(field.value)) return '';
        return field.value
            .map((value: string) => field.options.find((item: any) => item.value === value)?.label || '')
            .filter((name: string) => name !== '')
            .join(', ');
    };


    const getFinancialYear = (dateString: any) => {
        const date = new Date(dateString);
        let year = date.getFullYear();
        let nextYear = year + 1;

        // Financial year logic (April to March)
        if (date.getMonth() < 3) { // If Jan, Feb, or March
            year -= 1;
            nextYear -= 1;
        }

        return `${year.toString().slice(-2)}-${nextYear.toString().slice(-2)}`;
    };

    const getClientAbbreviation = (clientName: any) => {
        if (!clientName) return "";
        return clientName.split(" ").map((word: any) => word[0]).join("").toUpperCase();
    };

    const createNewClient = async (event: FormEvent) => {
        event.preventDefault();
        let companyValidityFlag = true;

        _.each(clientForm, (item: any) => {
            if (item?.validation?.required) {
                companyValidityFlag = companyValidityFlag && item.value;
            }
        });

        setIsFormValid(companyValidityFlag);

        // Prepare invoice data
        const invoiceData = {
            invoiceItems: invoiceItems.map((item: any) => ({
                description: item.description,
                sacCode: item.sacCode,
                amount: item.amount
            })),
            totalAmount: totalAmount.toFixed(2),
            gstTotal: gstTotal.toFixed(2),
            finalAmount: (totalAmount + gstTotal).toFixed(2),
            taxBreakdown: taxCalculations.map((tax: any) => ({
                taxFieldName: tax.taxFieldName,
                taxPercentage: tax.taxPercentage,
                calculatedAmount: tax.calculatedAmount.toFixed(2)
            }))
        };

        console.log("Final Invoice Data:", invoiceData, clientForm);

        if (!companyValidityFlag) {
            ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
            return;
        }

        // Extract values from form
        const poAmount = parseFloat(clientForm.remain_po_amount.value) || 0;
        const invoiceAmount = parseFloat(clientForm.invoice_amount.value) || 0;

        // Validation checks
        if (invoiceAmount > poAmount) {
            ToasterService.show("Credit Amount cannot be greater than remain PO Amount!", CONSTANTS.ERROR);
            return;
        }

        if (parseFloat(invoiceData.totalAmount) !== invoiceAmount) {
            ToasterService.show("Total Amount must match Credit Amount!", CONSTANTS.ERROR);
            return;
        }

        console.log('Processing with valid data:', poContractsData, clientForm, poContractsData.find((item: any) => item.po_name === clientForm.contract_name.value));

        const clientId = poContractConfData.find((item: any) => item.client_name === clientForm.client_name.value)?.client_id || '';
        const contractId = poContractsData.find((item: any) => item.po_name === clientForm.contract_name.value)?.clientId || '';
        const invoiceBillFromId = companyLocationMaster.find((el: any) => concatAddresses(el.address1, el?.address2, el?.address3) == clientForm.bill_from.value)?.id ?? null;
        const taxTypeId = taxMaster.find((el: any) => el?.taxType == clientForm.tax_type.value)?.id ?? null;

        let taxCodeId = "";
        clientForm?.tax_code?.value?.forEach((item: any) => {
            const id = taxMaster?.find((com: any) => com?.taxFieldName == item)?.id ?? null;
            if (id != null) {
                taxCodeId = taxCodeId != "" ? taxCodeId + "," + id : id;
            }
        });

        const formData: any = new FormData();
        const clientAbbr = getClientAbbreviation(clientForm.client_name.value);
        const financialYear = getFinancialYear(clientForm.invoice_date.value);
        const invoiceName = `${clientAbbr}/${financialYear}`;

        const obj = {
            client_name: clientForm.client_name.value || '',
            client_id: clientId,
            invoice_name: invoiceName,
            contract_name: clientForm.contract_name.value || '',
            contract_id: contractId,
            po_number: clientForm.po_number.value || '',
            // po_amount: poAmount.toFixed(2),
            po_amount: clientForm.po_amount.value || '',
            remain_po_amount: clientForm.remain_po_amount.value || '',
            invoice_date: clientForm.invoice_date.value ? formatDate(clientForm.invoice_date.value) : null,
            clientBillTo: clientForm.clientBillTo.value?.toString() || '',
            clientShipAddress: clientForm.clientShipAddress.value?.toString() || '',
            clientContact: clientForm.clientContact.value?.toString() || '',
            company_name: clientForm.company_name.value || '',
            bill_from: clientForm.bill_from.value || '',
            invoice_bill_from_id: invoiceBillFromId,
            // contract_type: clientForm.contract_type.value || '',
            projectService_names: clientForm.projectService.options.find((item: any) => item.value === clientForm.projectService.value)?.label || '',
            projectService: clientForm.projectService.value || '',
            tax_type: clientForm.tax_type.value || '',
            tax_type_id: taxTypeId,
            tax_code: clientForm.tax_code.value?.toString() || '',
            tax_code_id: taxCodeId,
            invoice_amount: invoiceAmount.toFixed(2),
            note_one: clientForm.note_one.value || '',
            note_two: clientForm.note_two.value || '',
            clientBillTo_name: getNamesFromOptions(clientForm.clientBillTo),
            clientShipAddress_name: getNamesFromOptions(clientForm.clientShipAddress),
            // clientContact_name: getNamesFromOptions(clientForm.clientContact),
            clientContact_name: clientForm.clientContact.options.find((item: any) => item.value === clientForm.clientContact.value)?.label || '',
            total_amount: invoiceData.totalAmount,
            final_amount: invoiceData.finalAmount,
            gst_total: invoiceData.gstTotal,
            invoiceData: JSON.stringify(invoiceData),
            updated_by: loggedInUserId,
            isActive: 1
        };

        Object.entries(obj).forEach(([key, value]: any) => {
            formData.set(key, value);
        });

        console.log("Final formData:", obj, formData);

        if (!cliendData?.id) {
          creditNoteService
                .createCreditNote(formData)
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
            const updatePayload = { ...obj, id: cliendData?.id, invoice_name: cliendData?.invoice_name };

            Object.entries(updatePayload).forEach(([key, value]: any) => {
                formData.set(key, value);
            });

            creditNoteService
                .updateCreditNote(formData)
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
    };

    const addRow = () => {
        setInvoiceItems([...invoiceItems, { id: Date.now(), description: "", sacCode: "", amount: 0 }]);
    };

    const handleInputChange = (e: any, index: any, field: any) => {
        const updatedItems = [...invoiceItems];
        updatedItems[index][field] = e.target.value;
        setInvoiceItems(updatedItems);
    };

    const handleAmountChange = (e: any, index: any) => {
        const updatedItems = [...invoiceItems];
        updatedItems[index].amount = e.value;
        setInvoiceItems(updatedItems);
    };

    const totalAmount = invoiceItems.reduce((sum: any, item: any) => sum + (parseFloat(item.amount) || 0), 0);

    const gstAmount = selectedTaxes.reduce((sum: any, tax: any) => sum + (totalAmount * (tax.taxPercentage / 100)), 0);

    const taxCalculations = selectedTaxes.map((tax: any) => ({
        ...tax,
        calculatedAmount: totalAmount * (tax.taxPercentage / 100)
    }));

    const gstTotal = taxCalculations.reduce((sum: any, tax: any) => sum + tax.calculatedAmount, 0);

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
                    label="Add New Credit Note"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={openSaveForm}
                />
            </div>
            <p className="m-0">
                <DataTableBasicDemo
                    data={invoiceMasterData}
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
                                <h4 className="popup-heading">{isEditClient ? 'Update' : 'Add'} Credit Note</h4>
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


                            <div>
                                {/* Header with Button */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <h5 style={{ margin: 0, fontWeight: "600", color: "#333" }}>Add Credit Note Items Detail</h5>
                                    <Button
                                        onClick={addRow}
                                        label="Add Row"
                                        style={{
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            padding: "4px 12px",
                                            borderRadius: "5px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            border: "none"
                                        }}
                                    />
                                </div>

                                {/* Styled Table */}
                                <DataTable
                                    value={invoiceItems}
                                    responsiveLayout="scroll"
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                                        overflow: "hidden"
                                    }}
                                >
                                    <Column field="description" header="Description" body={(rowData, { rowIndex }) => (
                                        <InputText
                                            value={rowData.description}
                                            onChange={(e) => handleInputChange(e, rowIndex, "description")}
                                            style={{
                                                height: "28px",
                                                fontSize: "14px",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                border: "1px solid #ccc",
                                                width: "100%"
                                            }}
                                        />
                                    )} />
                                    <Column field="sacCode" header="SAC Code" body={(rowData, { rowIndex }) => (
                                        <InputText
                                            value={rowData.sacCode}
                                            onChange={(e) => handleInputChange(e, rowIndex, "sacCode")}
                                            style={{
                                                height: "28px",
                                                fontSize: "14px",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                border: "1px solid #ccc",
                                                width: "100%"
                                            }}
                                        />
                                    )} />
                                    <Column field="amount" header="Amount" body={(rowData, { rowIndex }) => (
                                        <InputNumber
                                            value={rowData.amount}
                                            onValueChange={(e) => handleAmountChange(e, rowIndex)}
                                            mode="decimal"
                                            style={{
                                                width: "100%",
                                                height: "28px",
                                                fontSize: "14px",
                                                padding: "6px 10px",
                                                textAlign: "right",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                                backgroundColor: "#fff",
                                                outline: "none",
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: "border-color 0.2s ease-in-out"
                                            }}
                                            inputStyle={{
                                                width: "100%",
                                                height: "28px",
                                                padding: "0px",
                                                border: "none", // Ensures only one border is applied
                                                outline: "none",
                                                backgroundColor: "transparent"
                                            }}
                                        />
                                    )} />
                                </DataTable>

                                {/* Total Calculation UI */}
                                <div style={{
                                    textAlign: "right",
                                    padding: "15px",
                                    marginTop: "10px",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "5px",
                                    boxShadow: "0px 1px 4px rgba(0,0,0,0.1)"
                                }}>
                                    <h6 style={{ marginBottom: "5px", fontWeight: "600" }}>Total: {totalAmount.toFixed(2)}</h6>
                                    {taxCalculations.map((tax: any, index: any) => (
                                        <h6 key={index} style={{ marginBottom: "5px", fontSize: "14px", color: "#555" }}>
                                            {tax.taxFieldName}@{tax.taxPercentage}%: {tax.calculatedAmount.toFixed(2)}
                                        </h6>
                                    ))}
                                    <h6 style={{ marginBottom: "5px", fontWeight: "600", color: "#333" }}>Total GST: {gstTotal.toFixed(2)}</h6>
                                    <h6 style={{ fontWeight: "700", fontSize: "16px", color: "#222" }}>Total Amount: {(totalAmount + gstTotal).toFixed(2)}</h6>
                                </div>
                            </div>


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

export default CreditNoteMaster;

