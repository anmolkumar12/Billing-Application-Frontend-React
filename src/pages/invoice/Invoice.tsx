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

const InvoiceMaster = () => {

    const clientFormFields: any = {
        client_name: {
            inputType: "singleSelect",
            label: "Client",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        contract_name: {
            inputType: "singleSelect",
            label: "Contract",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },

        po_number: {
            inputType: "inputtext",
            label: "PO Number",
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        po_amount: {
            inputType: "inputtext",
            label: "PO Amount",
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        remain_po_amount: {
            inputType: "inputtext",
            label: "Remain PO Amount",
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        invoice_date: {
            inputType: "singleDatePicker",
            label: "Invoice Date",
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        clientBillTo: {
            inputType: "multiSelect",
            label: "Client Bill Address",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        clientShipAddress: {
            inputType: "multiSelect",
            label: "Client Ship Address",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        clientContact: {
            inputType: "singleSelect",
            label: "Contact",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        company_name: {
            inputType: "inputtext",
            label: "Company Name",
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        bill_from: {
            inputType: "singleSelect",
            label: "Bill From",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        contract_type: {
            inputType: "singleSelect",
            label: "Contract Type",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        tax_type: {
            inputType: "singleSelect",
            label: "Tax Type",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        tax_code: {
            inputType: "multiSelect",
            label: "Tax Code",
            options: [],
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-4",
        },
        invoice_amount: {
            inputType: "inputNumber",
            label: "Invoice Amount",
            value: null,
            validation: { required: false },
            fieldWidth: "col-md-6",
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




    // const clientMasterColumns = [
    //     {
    //         label: "Action",
    //         fieldName: "action",
    //         textAlign: "left",
    //         frozen: false,
    //         sort: false,
    //         filter: false,
    //         body: (rowData: any) => (
    //             <div style={{ display: "flex", gap: "12px", marginLeft: "20px" }}>
    //                 <span
    //                     className="pi pi-pencil"
    //                     style={{ cursor: "pointer" }}
    //                     title="Update"
    //                     onClick={() => onUpdate(rowData)}
    //                 ></span>
    //                 <span
    //                     className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
    //                     style={{ cursor: "pointer" }}
    //                     title={rowData.isActive ? "Deactivate" : "Activate"}
    //                     onClick={() => onDelete(rowData)}
    //                 ></span>
    //                 <span
    //                     className="pi pi-sync"
    //                     style={{ cursor: "pointer" }}
    //                     title="Update MSA"
    //                     onClick={() => onMSAUpdate(rowData)}
    //                 ></span>
    //             </div>
    //         ),
    //     },
    //     {
    //         label: "Client Name",
    //         fieldName: "client_name",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Client Name",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`clientNameTooltip-${rowData.id}`} content={rowData.client_name} />
    //         ),
    //     },
    //     {
    //         label: "Vega Client Name",
    //         fieldName: "vega_client_name",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Vega Client Name",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`vegaClientNameTooltip-${rowData.id}`} content={rowData.vega_client_name} />
    //         ),
    //     },
    //     {
    //         label: "Client Type",
    //         fieldName: "client_type",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Client Type",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`clientTypeTooltip-${rowData.id}`} content={rowData.client_type} />
    //         ),
    //     },
    //     {
    //         label: "Credit Period (No. of Days)",
    //         fieldName: "credit_period",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Credit Period",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`creditPeriodTooltip-${rowData.id}`} content={rowData.credit_period} />
    //         ),
    //     },
    //     {
    //         label: "Client Status",
    //         fieldName: "client_status",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Client Status",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`clientStatusTooltip-${rowData.id}`} content={rowData.client_status} />
    //         ),
    //     },
    //     {
    //         label: "Country",
    //         fieldName: "countryName",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Country",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`countryTooltip-${rowData.id}`} content={rowData.countryName} />
    //         ),
    //     },
    //     {
    //         label: "Company Name",
    //         fieldName: "companyName",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Company Name",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`companyNameTooltip-${rowData.id}`} content={rowData.companyName} />
    //         ),
    //     },

    //     {
    //         label: "Industry Head Name",
    //         fieldName: "industryHeadName",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Industry Head Name",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`industryHeadTooltip-${rowData.id}`} content={rowData.industryHeadName} />
    //         ),
    //     },
    //     {
    //         label: "Industry Sub Group",
    //         fieldName: "industryGroupNames",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Industry Group Names",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`industryGroupTooltip-${rowData.id}`} content={rowData.industryGroupNames} />
    //         ),
    //     },
    //     {
    //         label: "Industry Group",
    //         fieldName: "industryName",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Industry Name",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`industryNameTooltip-${rowData.id}`} content={rowData.industryName} />
    //         ),
    //     },
    //     // {
    //     //     label: "Industry Subgroup Names",
    //     //     fieldName: "industrySubGroupNames",
    //     //     textAlign: "left",
    //     //     sort: true,
    //     //     filter: true,
    //     //     placeholder: "Industry Subgroup Names",
    //     //     body: (rowData: any) => (
    //     //         <TooltipWrapper id={`industrySubgroupTooltip-${rowData.id}`} content={rowData.industrySubGroupNames} />
    //     //     ),
    //     // },
    //     {
    //         label: "Account Manager Names",
    //         fieldName: "accountManagerNames",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Account Manager Names",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`accountManagerTooltip-${rowData.id}`} content={rowData.accountManagerNames} />
    //         ),
    //     },
    //     {
    //         label: "MSA Start Date",
    //         fieldName: "msa_start_date",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "MSA Start Date",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`msaStartTooltip-${rowData.id}`} content={new Date(rowData.msa_start_date).toLocaleDateString()} />
    //         ),
    //     },
    //     {
    //         label: "MSA End Date",
    //         fieldName: "msa_end_date",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "MSA End Date",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`msaEndTooltip-${rowData.id}`} content={new Date(rowData.msa_end_date).toLocaleDateString()} />
    //         ),
    //     },
    //     {
    //         label: "MSA available?",
    //         fieldName: "msa_flag",
    //         textAlign: "left",
    //         frozen: false,
    //         sort: true,
    //         filter: true,
    //         body: (rowData: any) => (
    //             <div>
    //                 <span>
    //                     {rowData?.msa_flag == 1 ? "Yes" : "No"}
    //                 </span>
    //             </div>
    //         ),
    //     },
    //     {
    //         label: "MSA File",
    //         fieldName: "msaFilePath",
    //         textAlign: "left",
    //         sort: false,
    //         filter: false,
    //         placeholder: "MSA File",
    //         body: (rowData: any) => (
    //             <>
    //                 {rowData?.msaFilePath ? (
    //                     <div onClick={() => downloadFile(rowData.msaFilePath)} >
    //                         <span style={{
    //                             cursor: "pointer", // Pointer cursor on hover
    //                             color: "#007bff", // Icon color (same as text)
    //                         }}>MSA</span>
    //                         <span
    //                             className="pi pi-download" // Use the PrimeIcons class for download icon
    //                             style={{
    //                                 cursor: "pointer", // Pointer cursor on hover
    //                                 marginLeft: "8px", // Space between text and icon
    //                                 fontSize: "10px", // Icon size
    //                                 color: "#007bff", // Icon color (same as text)
    //                             }}
    //                             title="Download MSA"
    //                         ></span>
    //                     </div>

    //                 ) : null}
    //             </>),
    //     },
    //     {
    //         label: "NDA available?",
    //         fieldName: "nda_flag",
    //         textAlign: "left",
    //         frozen: false,
    //         sort: true,
    //         filter: true,
    //         body: (rowData: any) => (
    //             <div>
    //                 <span>
    //                     {rowData?.nda_flag == 1 ? "Yes" : "No"}
    //                 </span>
    //             </div>
    //         ),
    //     },
    //     {
    //         label: "NDA File",
    //         fieldName: "ndaFilePath",
    //         textAlign: "left",
    //         sort: false,
    //         filter: false,
    //         placeholder: "NDA File",
    //         body: (rowData: any) =>
    //         (<>
    //             {rowData?.ndaFilePath ? (
    //                 <div onClick={() => downloadFile(rowData.ndaFilePath)} >
    //                     <span style={{
    //                         cursor: "pointer", // Pointer cursor on hover
    //                         color: "#007bff", // Icon color (same as text)
    //                     }}>NDA</span>
    //                     <span
    //                         className="pi pi-download" // Use the PrimeIcons class for download icon
    //                         style={{
    //                             cursor: "pointer", // Pointer cursor on hover
    //                             marginLeft: "8px", // Space between text and icon
    //                             fontSize: "10px", // Icon size
    //                             color: "#007bff", // Icon color (same as text)
    //                         }}
    //                         title="Download MSA"
    //                     ></span>
    //                 </div>

    //             ) : null}
    //         </>),
    //     },
    //     {
    //         label: "Status",
    //         fieldName: "isActive",
    //         textAlign: "left",
    //         frozen: false,
    //         sort: true,
    //         filter: true,
    //         body: (rowData: any) => (
    //             <div>
    //                 <span style={{ color: rowData?.isActive == 1 ? "green" : "red" }}>
    //                     {rowData?.isActive == 1 ? "Active" : "Inactive"}
    //                 </span>
    //             </div>
    //         ),
    //     },
    //     {
    //         label: "Updated At",
    //         fieldName: "updated_at",
    //         textAlign: "left",
    //         sort: true,
    //         filter: true,
    //         placeholder: "Updated At",
    //         body: (rowData: any) => (
    //             <TooltipWrapper id={`updatedAtTooltip-${rowData.id}`} content={new Date(rowData.updated_at).toLocaleString()} />
    //         ),
    //     }
    // ];

    const clientMasterColumns = [
        {
            label: "Invoice Name",
            fieldName: "invoice_name",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Invoice Name",
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
            label: "Invoice Date",
            fieldName: "invoice_date",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Invoice Date",
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
            label: "Contract Type",
            fieldName: "contract_type",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Contract Type",
            body: (rowData: any) => (
                <TooltipWrapper id={`contractTypeTooltip-${rowData.id}`} content={rowData.contract_type} />
            ),
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
            label: "Invoice Amount",
            fieldName: "invoice_amount",
            textAlign: "left",
            sort: true,
            filter: true,
            placeholder: "Invoice Amount",
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



    // useEffect(() => {
    //     const fetchData = async () => {
    //         await getClientMaster();
    //         // await getStateMaster();
    //         const countries = await getCountryMaster();
    //         await formatCountryDetails(countries);
    //         const companies = await getCompanyMaster();
    //         await formatCompanyDetails(companies);
    //         const industryHead = await getIndustryHeadMaster();
    //         await formatIndustryHeadDetails(industryHead);
    //         const industryGroups = await getIndustryGroupMaster();
    //         await formatIndustryGroupDetails(industryGroups);
    //         // const accountManagers = await getAccountManagerMaster();
    //         // await formatAccountManagerMasterDetails(accountManagers);
    //         // const accountMaster = await getAccountMaster();
    //         // await formatAccountMasterDetails(accountMaster);
    //         // const salesManager = await getSalesMaster();
    //         // await formatSalesManagerDetails(salesManager)
    //         // await formatAccountMasterDetails(accountMaster);
    //         const industries = await getIndustryMaster()
    //         await formatIndustry_ClientDetails(industries);
    //         await formatIndustrySubGroupDetails(industries)
    //     };
    //     if (clientFormPopup == false && showConfirmDialogue == false && showMsaUpdatePopup == false) {
    //         fetchData();
    //     }
    // }, [clientFormPopup, showConfirmDialogue, showMsaUpdatePopup]);


    useEffect(() => {
        const fetchData = async () => {
            getInvoiceData()
            getContractMaster();
            getPoContractConfiguration();
            getTaxMaster();
            getCompanyLocationMaster();
        };
        if (clientFormPopup == false && showConfirmDialogue == false && showMsaUpdatePopup == false) {
            fetchData();
        }
    }, [clientFormPopup, showConfirmDialogue, showMsaUpdatePopup]);


    const getInvoiceData = async () => {
        setLoader(true);
        try {
            const response = await invoiceService.getInvoicesData();
            setInvoiceMasterData(response?.invoices);
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };
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
    const getPoContractConfiguration = async () => {
        setLoader(true);
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
            setLoader(false);
        }
    };


    const getTaxMaster = async () => {
        setLoader(true);
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
        setLoader(true);
        try {
            const response = await companyService.getCompanyLocationMaster();
            console.log('setCompanyLocationMaster', response?.locations);

            setCompanyLocationMaster(response?.locations);
            return response?.locations;
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
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
        // objFormState.projectService.options = Array.isArray(poMastersConfigData?.projectService)
        //   ? poMastersConfigData?.projectService.map((item: any) => ({
        //     label: item?.name,
        //     value: item.id.toString(),
        //   }))
        //   : [];

        const taxDetails = taxMaster.map((item: any) => item?.taxType);
        clientForm.tax_type.options = taxDetails;
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
                        isDefault: concatAddresses(item.address1, item.address2, item.address3) == selectedContract?.masterNames?.clientBillTo ? 1 : 0
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

                // console.log('aaaaaaaaaaaaaa', companyLocationMaster?.filter((ele: any) => ele.companyName
                // == form.company_name?.value));


                // form.bill_from.options = companyLocationMaster?.filter((ele: any) => ele.companyName
                //     == form.company_name?.value).map((item: any, index: any) => {
                //         return {
                //             label: concatAddresses(item?.address1, item?.address2, item?.address3),
                //             value: item.id.toString(),
                //             isDefault: item?.isDefaultAddress
                //         }
                //     })

                // const defaultBillFrom = form.bill_from?.options?.find((ele: any) => ele.isDefaultAddress == 1);
                // if (defaultBillFrom && defaultBillFrom?.value) {
                //     form.bill_from.value = [defaultBillFrom?.value.toString()];
                // }
                // else {
                //     form.bill_from.value = null;
                // }
                // console.log('defaultBillFrom', form, form.bill_from.options,defaultBillFrom);

                //   form.companyName.value = configData?.companyInfo.companyName;
                //   form.companyName.disable = false;


                //   form.companyLocation.options = [{ label: concatAddresses(configData?.companyLocation?.address1, configData?.companyLocation?.address2, configData?.companyLocation?.address3) || "", value: configData?.companyLocation?.id.toString() }];
                //   form.companyLocation.value = configData?.companyLocation?.id.toString()

                // console.log('form handler checking selectedClient---->>> ', defaultContact, form);
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

    const msaFormHandler = async (currentForm: FormType) => {
        const form = _.cloneDeep(currentForm);
        setMsaForm(form);
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
        const companyFormValid: boolean[] = [];


        _.each(clientForm, (item: any) => {
            if (item?.validation?.required) {
                // companyFormValid.push(item.value);
                companyValidityFlag = companyValidityFlag && item.value; // Ensure boolean value
            }
        });


        setIsFormValid(companyValidityFlag);
        // console.log('clientForm', clientForm, companyValidityFlag);


        // Prepare invoice data
        const invoiceData = {
            // taxCode: taxCode,
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

        if (companyValidityFlag) {

            console.log('dddddddddddd', companyLocationMaster, clientForm?.bill_from?.value);


            const clientId = poContractConfData.find((item: any) => item.client_name === clientForm.client_name.value)?.client_id || '';

            const contractId = poContractsData.find((item: any) => item.po_name === clientForm.contract_name.value)?.client_id || '';

            const invoiceBillFromId = companyLocationMaster.find((el: any) => concatAddresses(el.address1, el?.address2, el?.address3) == clientForm.bill_from.value)?.id ?? null;

            const taxTypeId = taxMaster.find((el: any) => el?.taxType == clientForm.tax_type.value)?.id ?? null;


            let taxCodeId = "";
            clientForm?.tax_code?.value?.forEach((item: any) => {
                const id =
                    taxMaster?.find(
                        (com: any) => com?.taxFieldName == item
                    )?.id ?? null;
                if (id != null) {
                    taxCodeId =
                        taxCodeId != "" ? taxCodeId + "," + id : id;
                }
            });

            console.log('dddddddddddd -checkkkk', getNamesFromOptions(clientForm.clientBillTo));

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
                po_amount: clientForm.po_amount.value || '',
                remain_po_amount: clientForm.remain_po_amount.value || '',
                invoice_date: clientForm.invoice_date.value ? formatDate(clientForm.invoice_date.value) : null,
                clientBillTo: clientForm.clientBillTo.value?.toString() || '',
                clientShipAddress: clientForm.clientShipAddress.value?.toString() || '',
                clientContact: clientForm.clientContact.value?.toString() || '',
                company_name: clientForm.company_name.value || '',
                bill_from: clientForm.bill_from.value || '',
                invoice_bill_from_id: invoiceBillFromId,
                contract_type: clientForm.contract_type.value || '',
                tax_type: clientForm.tax_type.value || '',
                tax_type_id: taxTypeId,
                tax_code: clientForm.tax_code.value?.toString() || '',
                tax_code_id: taxCodeId,
                invoice_amount: clientForm.invoice_amount.value || '',
                note_one: clientForm.note_one.value || '',
                note_two: clientForm.note_two.value || '',

                clientBillTo_name: getNamesFromOptions(clientForm.clientBillTo),
                clientShipAddress_name: getNamesFromOptions(clientForm.clientShipAddress),
                clientContact_name: getNamesFromOptions(clientForm.clientContact),

                total_amount: invoiceData.totalAmount || '',
                final_amount: invoiceData.finalAmount || '',
                gst_total: invoiceData.gstTotal || '',

                invoiceData: JSON.stringify(invoiceData) || {},

                // invoiceData: JSON.stringify(invoiceData) || {},
                updated_by: loggedInUserId,
                isActive: 1
            };



            Object.entries(obj).forEach(([key, value]: any) => {
                formData.set(key, value);
            });
            console.log("here formData", formData);

            console.log('createClientForm : ', clientForm, obj);


            if (!cliendData?.id) {
                invoiceService
                    .createInvoice(formData)
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

                invoiceService
                    .updateInvoice(formData)
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

    const [invoiceItems, setInvoiceItems] = useState<any>([]);
    const [selectedTaxes, setSelectedTaxes] = useState<any>([])
    const [selectedApplicableTaxes, setSelectedApplicableTaxes] = useState<any>([])

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
                    label="Add New Client"
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


                            <div>
                                <div>
                                    <h6>Add Invoice Items Detail</h6>
                                    <DataTable value={invoiceItems} responsiveLayout="scroll">
                                        <Column field="description" header="Description" body={(rowData, { rowIndex }) => (
                                            <InputText value={rowData.description} onChange={(e) => handleInputChange(e, rowIndex, "description")} />
                                        )} />
                                        <Column field="sacCode" header="SAC Code" body={(rowData, { rowIndex }) => (
                                            <InputText value={rowData.sacCode} onChange={(e) => handleInputChange(e, rowIndex, "sacCode")} />
                                        )} />
                                        <Column field="amount" header="Amount" body={(rowData, { rowIndex }) => (
                                            <InputNumber value={rowData.amount} onValueChange={(e) => handleAmountChange(e, rowIndex)} mode="decimal" />
                                        )} />
                                    </DataTable>
                                    <Button onClick={addRow} label="Add Row" style={{ marginTop: 10, padding: "2px 10px" }} />
                                </div>

                                <div style={{ float: "right", padding: "10px", width: "230px" }}>
                                    {/* <h4>Tax Details</h4> */}
                                    {/* {selectedApplicableTaxes.map((tax: any, index: any) => (
                                        <div key={index}>
                                            <input
                                                type="checkbox"
                                                checked={selectedTaxes.includes(tax)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedTaxes([...selectedTaxes, tax]);
                                                    } else {
                                                        setSelectedTaxes(selectedTaxes.filter((t: any) => t.taxFieldName !== tax.taxFieldName));
                                                    }
                                                }}
                                            />
                                            {tax.taxFieldName} ({tax.taxPercentage}%)
                                        </div>
                                    ))} */}

                                    <h6>Total: {totalAmount.toFixed(2)}</h6>
                                    {taxCalculations.map((tax: any, index: any) => (
                                        <h6 key={index}>{tax.taxFieldName}@{tax.taxPercentage}%: {tax.calculatedAmount.toFixed(2)}</h6>
                                    ))}
                                    <h6>Total GST: {gstTotal.toFixed(2)}</h6>
                                    <h6>Total Amount: {(totalAmount + gstTotal).toFixed(2)}</h6>

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

export default InvoiceMaster;

