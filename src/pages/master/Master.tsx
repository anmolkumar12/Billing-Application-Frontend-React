/* eslint-disable no-unexpected-multiline */
import React, { FormEvent, useEffect, useState } from "react";
import "primeicons/primeicons.css";
import { CompanyMasterService } from "../../services/masters/company-master/company.service";
import { CurrencyMasterService } from "../../services/masters/currency-master/currency.service";
import { IndustryMasterService } from "../../services/masters/industry-master/industry.service";
import { AccountsMasterService } from "../../services/masters/accounts-master/accounts.service";
import { ProductMasterService } from "../../services/masters/product-master/product.service";
import { ProjectMasterService } from "../../services/masters/projects-master/project.service";
import { TaxMasterService } from "../../services/masters/tax-master/tax.service";
import { CountryMasterService } from "../../services/masters/country-master/country.service";
import { StateMasterService } from "../../services/masters/state-master/state.service";
import { ClientMasterService } from "../../services/masters/client-master/client.service";

import { TabView, TabPanel } from "primereact/tabview";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";

import DataTableBasicDemo from "../../components/ui/table/Table";
import { Loader } from "../../components/ui/loader/Loader";
import { Tooltip } from "primereact/tooltip";
import { ToasterService } from "../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../constants/Constants";
import { ButtonComponent } from "../../components/ui/button/Button";
import { FormComponent } from "../../components/ui/form/form";
import classes from "./Master.module.scss";
import _, { unset } from "lodash";
import { FormType } from "../../schemas/FormField";
import { AuthService } from "../../services/auth-service/auth.service";
import { FILE_TYPES } from "../../enums/file-types.enum";
import { ImageUrl } from "../../utils/ImageUrl";
import { Chip } from "primereact/chip";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";

const Master: React.FC = () => {
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const [currencyMaster, setCurrencyMaster] = useState([]);
  const [industryMaster, setIndustryMaster] = useState<any>([]);
  const [accountsMaster, setAccountsMaster] = useState<any>([]);
  const [productsMaster, setProductsMaster] = useState([]);
  const [projectsMaster, setProjectsMaster] = useState([]);
  const [taxMaster, setTaxMaster] = useState([]);
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [stateMaster, setStateMaster] = useState<any>([]);
  const [clientMaster, setClientMaster] = useState([]);
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

  const companyService = new CompanyMasterService();
  const currencyService = new CurrencyMasterService();
  const industryService = new IndustryMasterService();
  const accountsService = new AccountsMasterService();
  const productService = new ProductMasterService();
  const projectService = new ProjectMasterService();
  const taxService = new TaxMasterService();
  const countryService = new CountryMasterService();
  const stateService = new StateMasterService();
  const clientService = new ClientMasterService();

  useEffect(() => {
    const fetchData = async () => {
      switch (activeIndex) {
        case 0:
          await getCompanyMaster();
          break;
        case 1:
          await getCurrencyMaster();
          break;
        case 2:
          await getAccountsMaster();
          await getCompanyMaster();
          await formatCompanyDetails();
          break;
        case 3:
          await getIndustryMaster();
          break;
        case 4:
          await getProductMaster();
          break;
        case 5:
          await getProjectMaster();
          break;
        case 6:
          await getTaxMaster();
          break;
        case 7:
          await getCountryMaster();
          break;
        case 8:
          await getStateMaster();
          await getCountryMaster();
          await formatCountry_StateDetails();
          break;
        case 9:
          setOpenClientForm(false);
          setActiveClientIndex(0);
          await getClientMaster();
          await getIndustryMaster();
          await getCountryMaster();
          await getStateMaster();
          await getAccountsMaster();
          await formatIndustry_ClientDetails();
          await formatCountry_ClientDetails();
          await formatState_ClientDetails();
          await formatAccount_ClientDetails();
          await formatCountry_Client_ShipDetails();
          await formatState_Client_ShipDetails();
          break;
        default:
          break;
      }
    };
    fetchData();
  }, [activeIndex]);

  const onTabChange = (e: any) => {
    setActiveIndex(e.index);
  };

  const onClientTabChange = (e: any) => {
    setActiveClientIndex(e.index);
  };

  const formatCompanyDetails = async () => {
    const companyList = companyMaster.map(
      (company: any) => company?.companyName
    );
    accountFieldsStructure.companyName.options = companyList;
    await setAccountFieldsStructure(accountFieldsStructure);
    await accountsFormHandler(accountFieldsStructure);
  };

  const formatIndustry_ClientDetails = async () => {
    const industryList = industryMaster.map(
      (industry: any) => industry?.industryName
    );
    clientFieldsStructure.industry_name.options = industryList;
    await setClientFieldsStructure(clientFieldsStructure);
    await clientFormHandler(clientFieldsStructure);
  };

  const formatCountry_ClientDetails = async () => {
    const countrylist = countryMaster.map((country: any) => country?.name);
    clientBillFieldsStructure.country_name.options = countrylist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

  const formatCountry_StateDetails = async () => {
    const countrylist = countryMaster.map((country: any) => country?.name);
    statesFieldsStructure.country_name.options = countrylist;
    await setStatesFieldsStructure(statesFieldsStructure);
    await statesFormHandler(statesFieldsStructure);
  };

  const formatState_ClientDetails = async () => {
    console.log("stateMaster", stateMaster);
    const statelist = stateMaster.map((state: any) => state.state_name);
    console.log("state", statelist, clientBillFieldsStructure);
    clientBillFieldsStructure.state_name.options = statelist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

  const formatAccount_ClientDetails = async () => {
    const accountslist = accountsMaster.map(
      (account: any) => account?.account_no
    );
    clientBillFieldsStructure.polestar_bank_account_number.options =
      accountslist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

  const formatCountry_Client_ShipDetails = async () => {
    const countrylist = countryMaster.map((country: any) => country?.name);
    clientShipFieldsStructure.client_ship_to_country_name.options = countrylist;
    await setClientShipFieldsStructure(clientShipFieldsStructure);
    await clientShipFormHandler(clientShipFieldsStructure);
  };

  const formatState_Client_ShipDetails = async () => {
    const statelist = stateMaster.map((state: any) => state?.state_name);
    clientShipFieldsStructure.client_ship_to_state_name.options = statelist;
    await setClientShipFieldsStructure(clientShipFieldsStructure);
    await clientShipFormHandler(clientShipFieldsStructure);
  };

  const getCompanyMaster = async () => {
    setLoader(true);
    try {
      const response = await companyService.getCompanyMaster();
      setCompanyMaster(response?.companies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getCurrencyMaster = async () => {
    setLoader(true);
    try {
      const response = await currencyService.getCurrencyMaster();
      setCurrencyMaster(response?.currencies);
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
      setIndustryMaster(response?.industries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getAccountsMaster = async () => {
    setLoader(true);
    try {
      const response = await accountsService.getAccountsMaster();
      setAccountsMaster(response?.accounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getProductMaster = async () => {
    setLoader(true);
    try {
      const response = await productService.getProductMaster();
      setProductsMaster(response?.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getProjectMaster = async () => {
    setLoader(true);
    try {
      const response = await projectService.getProjectMaster();
      setProjectsMaster(response?.projects);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getTaxMaster = async () => {
    setLoader(true);
    try {
      const response = await taxService.getTaxMaster();
      setTaxMaster(response?.taxes);
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
      setCountryMaster(response?.countries);
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
      setClientMaster(response?.clients);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const deactivateCompanyMaster = () => {
    setLoader(true);
    companyService
      .deactivateCompanyMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Company record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getCompanyMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateCurrencyMaster = () => {
    setLoader(true);
    currencyService
      .deactivateCurrencyMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Currency record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getCurrencyMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateIndustryMaster = () => {
    setLoader(true);
    industryService
      .deactivateIndustryMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Industry record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getIndustryMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateAccountsMaster = () => {
    setLoader(true);
    accountsService
      .deactivateAccountsMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Accounts record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getAccountsMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateProductMaster = () => {
    setLoader(true);
    productService
      .deactivateProductMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Product record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getProductMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateProjectMaster = () => {
    setLoader(true);
    projectService
      .deactivateProjectMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Project record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getProjectMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateTaxMaster = () => {
    setLoader(true);
    taxService
      .deactivateTaxMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Tax record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getTaxMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateStatesMaster = () => {
    setLoader(true);
    stateService
      .deactivateStateMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "States record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getStateMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateClientMaster = () => {
    setLoader(true);
    clientService
      .deactivateClientMaster(patchData)
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          "Client record deactivated successfully",
          CONSTANTS.SUCCESS
        );
        getClientMaster();
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const openSaveForm = () => {
    setFormPopup(true);
  };

  const openClientFormButton = () => {
    setOpenClientForm(true);
  };

  const closeClientForm = () => {
    setOpenClientForm(false);
  };

  const selectAttachment = (files: any) => {
    console.log("files", files);

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
            const fileWithUrl = {
              ...eventList,
              preview: URL.createObjectURL(eventList),
            };
            setAttachments((prevVals: any) => [...prevVals, fileWithUrl]);
          }
        } else {
          ToasterService.show(
            `Invalid file format. You can only attach PNG files here!`,
            "error"
          );
          eventList = null;
        }
      });
    }
  };

  const removeFileHandler = (index: any) => {
    const updatedAttachments = attachments.filter(
      (_: any, i: any) => i !== index
    );
    setAttachments(updatedAttachments);
  };

  const confirmDelete = () => {
    switch (activeIndex) {
      case 0:
        deactivateCompanyMaster();
        break;
      case 1:
        deactivateCurrencyMaster();
        break;
      case 2:
        deactivateAccountsMaster();
        break;
      case 3:
        deactivateIndustryMaster();
        break;
      case 4:
        deactivateProductMaster();
        break;
      case 5:
        deactivateProjectMaster();
        break;
      case 6:
        deactivateTaxMaster();
        break;
      case 8:
        deactivateStatesMaster();
        break;
      case 9:
        deactivateClientMaster();
        break;
      default:
        break;
    }
  };

  const CompanyTableColumns = [
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
      label: "Company",
      fieldName: "companyName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "companyName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.companyName}
          >
            {rowData.companyName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Website",
      fieldName: "Website",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.Website}
          >
            {rowData.Website}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "CINNO",
      fieldName: "CINNO",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.CINNO}
          >
            {rowData.CINNO}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "IECode",
      fieldName: "IECode",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.IECode}
          >
            {rowData.IECode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "PAN",
      fieldName: "PAN",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.PAN}
          >
            {rowData.PAN}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "GST",
      fieldName: "gst_number",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.gst_number}
          >
            {rowData.gst_number}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Address",
      fieldName: "address",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.address}
          >
            {rowData.address}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Email",
      fieldName: "Email",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.Email}
          >
            {rowData.Email}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "description",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.description}
          >
            {rowData.description}
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
          <span style={{ color: rowData?.isactive == 1 ? "green" : "red" }}>
            {rowData?.isactive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const CurrencyMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Currency",
      fieldName: "currencyName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "currencyName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.currencyName}
          >
            {rowData.currencyName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "currencyDescription",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "currencyDescription",
      changeFilter: true,
      placeholder: "Description",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.currencyDescription}
          >
            {rowData.currencyDescription}
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
          <span style={{ color: rowData?.isActive == 1 ? "green" : "red" }}>
            {rowData?.isActive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const IndustryMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Industry",
      fieldName: "industryName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.industryName}
          >
            {rowData.industryName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Industry Head",
      fieldName: "industryHead",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryHead",
      changeFilter: true,
      placeholder: "Industry Head",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.industryHead}
          >
            {rowData.industryHead}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "description",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "description",
      changeFilter: true,
      placeholder: "Description",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.description}
          >
            {rowData.description}
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
          <span style={{ color: rowData?.isActive == 1 ? "green" : "red" }}>
            {rowData?.isActive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const AccountsMasterColumns = [
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
            className={`pi pi-${rowData.is_active ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.is_active ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Company",
      fieldName: "company_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "company_name",
      changeFilter: true,
      placeholder: "Company",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.company_name}
          >
            {rowData.company_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Account Type",
      fieldName: "account_type",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "account_type",
      changeFilter: true,
      placeholder: "Account Type",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.account_type}
          >
            {rowData.account_type}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Bank",
      fieldName: "bank_name",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.bank_name}
          >
            {rowData.bank_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Bank Address",
      fieldName: "bank_address",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.bank_address}
          >
            {rowData.bank_address}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Account Number",
      fieldName: "account_no",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.account_no}
          >
            {rowData.account_no}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "IFSC Code",
      fieldName: "ifsc_code",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.ifsc_code}
          >
            {rowData.ifsc_code}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "MICR Code",
      fieldName: "micr_code",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.micr_code}
          >
            {rowData.micr_code}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Swift Code",
      fieldName: "routing_no_swift_code",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.routing_no_swift_code}
          >
            {rowData.routing_no_swift_code}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Bank Code",
      fieldName: "bank_code",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.bank_code}
          >
            {rowData.bank_code}
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
      fieldName: "is_active",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span style={{ color: rowData?.is_active == 1 ? "green" : "red" }}>
            {rowData?.is_active == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const ProductsMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Product",
      fieldName: "productName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "productName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.productName}
          >
            {rowData.productName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "productDescription",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "productDescription",
      changeFilter: true,
      placeholder: "Description",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.productDescription}
          >
            {rowData.productDescription}
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
          <span style={{ color: rowData?.isActive == 1 ? "green" : "red" }}>
            {rowData?.isActive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const ProjectsMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Project",
      fieldName: "projectName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "projectName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.projectName}
          >
            {rowData.projectName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "projectDescription",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "projectDescription",
      changeFilter: true,
      placeholder: "Description",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.projectDescription}
          >
            {rowData.projectDescription}
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
          <span style={{ color: rowData?.isActive == 1 ? "green" : "red" }}>
            {rowData?.isActive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const TaxMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Type",
      fieldName: "taxType",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "taxType",
      changeFilter: true,
      placeholder: "Type",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.taxType}
          >
            {rowData.taxType}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Percentage",
      fieldName: "taxPercentage",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "taxPercentage",
      changeFilter: true,
      placeholder: "Percentage",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.taxPercentage}
          >
            {rowData.taxPercentage}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Effective Date",
      fieldName: "effectiveDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "effectiveDate",
      changeFilter: true,
      placeholder: "Effective Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.effectiveDate}
          >
            {rowData.effectiveDate}
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
          <span style={{ color: rowData?.isActive == 1 ? "green" : "red" }}>
            {rowData?.isActive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  const CountryMasterColumns = [
    {
      label: "Country",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.name}
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
      label: "Language",
      fieldName: "language",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "language",
      changeFilter: true,
      placeholder: "Language",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.language}
          >
            {rowData.language}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Country Code",
      fieldName: "code",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "code",
      changeFilter: true,
      placeholder: "Country Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.code}
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
      label: "Phone Code",
      fieldName: "phone_code",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "phone_code",
      changeFilter: true,
      placeholder: "Phone Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.phone_code}
          >
            {rowData.phone_code}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Currency",
      fieldName: "currency",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "currency",
      changeFilter: true,
      placeholder: "Currency",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.currency}
          >
            {rowData.currency}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
  ];

  const StateMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "State",
      fieldName: "state_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "state_name",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.state_name}
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
            data-pr-tooltip={rowData.state_code}
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
      label: "Country",
      fieldName: "country_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "country_name",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.country_name}
          >
            {rowData.country_name}
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

  const ClientMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "check-circle" : "ban"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Industry",
      fieldName: "industry_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industry_name",
      changeFilter: true,
      placeholder: "Industry",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.industry_name}
          >
            {rowData.industry_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Client Name",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Client Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.name}
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
      label: "Alias Name",
      fieldName: "alias",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "alias",
      changeFilter: true,
      placeholder: "Alias Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.alias}
          >
            {rowData.alias}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "PAN Number",
      fieldName: "pan_no",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "pan_no",
      changeFilter: true,
      placeholder: "PAN Number",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.pan_no}
          >
            {rowData.pan_no}
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
            data-pr-tooltip={rowData.address1}
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
            data-pr-tooltip={rowData.address2}
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
            data-pr-tooltip={rowData.address3}
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
      label: "PIN Number",
      fieldName: "pin",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "pin",
      changeFilter: true,
      placeholder: "PIN Number",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.pin}
          >
            {rowData.pin}
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
      fieldName: "country_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "country_name",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.country_name}
          >
            {rowData.country_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "State",
      fieldName: "state_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "state_name",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.state_name}
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
      label: "Polestar Bank Account Number",
      fieldName: "polestar_bank_account_number",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "polestar_bank_account_number",
      changeFilter: true,
      placeholder: "Polestar Bank Account Number",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.polestar_bank_account_number}
          >
            {rowData.polestar_bank_account_number}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "GSTN Number",
      fieldName: "gstn",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "gstn",
      changeFilter: true,
      placeholder: "GSTN Number",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.gstn}
          >
            {rowData.gstn}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Shipping Address 1",
      fieldName: "client_ship_to_address1",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_address1",
      changeFilter: true,
      placeholder: "Shipping Address 1",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_ship_to_address1}
          >
            {rowData.client_ship_to_address1}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Shipping Address 2",
      fieldName: "client_ship_to_address2",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_address2",
      changeFilter: true,
      placeholder: "Shipping Address 2",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_ship_to_address2}
          >
            {rowData.client_ship_to_address2}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Shipping Address 3",
      fieldName: "client_ship_to_address3",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_address3",
      changeFilter: true,
      placeholder: "Shipping Address 3",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_ship_to_address3}
          >
            {rowData.client_ship_to_address3}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Shipping PIN",
      fieldName: "client_ship_to_pin",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_pin",
      changeFilter: true,
      placeholder: "Shipping PIN",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_ship_to_pin}
          >
            {rowData.client_ship_to_pin}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Shipping Country",
      fieldName: "client_ship_to_country_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_country_name",
      changeFilter: true,
      placeholder: "Shipping Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_ship_to_country_name}
          >
            {rowData.client_ship_to_country_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Shipping State",
      fieldName: "client_ship_to_state_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_state_name",
      changeFilter: true,
      placeholder: "Shipping State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_ship_to_state_name}
          >
            {rowData.client_ship_to_state_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Shipping GSTN Number",
      fieldName: "client_ship_to_gstn",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_gstn",
      changeFilter: true,
      placeholder: "Shipping GSTN Number",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_ship_to_gstn}
          >
            {rowData.client_ship_to_gstn}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Salutation",
      fieldName: "salutation",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "salutation",
      changeFilter: true,
      placeholder: "Salutation",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.salutation}
          >
            {rowData.salutation}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "First Name",
      fieldName: "first_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "first_name",
      changeFilter: true,
      placeholder: "First Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.first_name}
          >
            {rowData.first_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Last Name",
      fieldName: "last_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "last_name",
      changeFilter: true,
      placeholder: "Last Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.last_name}
          >
            {rowData.last_name}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Email",
      fieldName: "email",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "email",
      changeFilter: true,
      placeholder: "Email",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.email}
          >
            {rowData.email}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Phone Number",
      fieldName: "phone",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "phone",
      changeFilter: true,
      placeholder: "Phone Number",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.phone}
          >
            {rowData.phone}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "MSA Flag",
      fieldName: "msa_flag",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "msa_flag",
      changeFilter: true,
      placeholder: "MSA Flag",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.msa_flag}
          >
            <span>{rowData?.msa_flag === 1 ? "Yes" : "No"}</span>
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "MSA Start Date",
      fieldName: "msa_start_date",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "msa_start_date",
      changeFilter: true,
      placeholder: "MSA Start Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.msa_start_date}
          >
            {rowData.msa_start_date}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "MSA End Date",
      fieldName: "msa_end_date",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "msa_end_date",
      changeFilter: true,
      placeholder: "MSA End Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.msa_end_date}
          >
            {rowData.msa_end_date}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Non Solicitation Clause",
      fieldName: "non_solicitation_clause",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "non_solicitation_clause",
      changeFilter: true,
      placeholder: "Non Solicitation Clause",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.non_solicitation_clause}
          >
            <span>{rowData?.non_solicitation_clause === 1 ? "Yes" : "No"}</span>
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Use Logo Permission",
      fieldName: "use_logo_permission",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "use_logo_permission",
      changeFilter: true,
      placeholder: "Use Logo Permission",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.use_logo_permission}
          >
            <span>{rowData?.use_logo_permission === 1 ? "Yes" : "No"}</span>
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Client Category",
      fieldName: "client_category",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_category",
      changeFilter: true,
      placeholder: "Client Category",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.client_category}
          >
            {rowData.client_category}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Servicing Type",
      fieldName: "servicing_type",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "servicing_type",
      changeFilter: true,
      placeholder: "Servicing Type",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.servicing_type}
          >
            {rowData.servicing_type}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Missing MSA Deadline",
      fieldName: "missing_msa_deadline",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "missing_msa_deadline",
      changeFilter: true,
      placeholder: "Missing MSA Deadline",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.missing_msa_deadline}
          >
            <span>{rowData?.missing_msa_deadline === 1 ? "Yes" : "No"}</span>
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "MSA Missing?",
      fieldName: "is_msa_missing",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "is_msa_missing",
      changeFilter: true,
      placeholder: "MSA Missing?",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.is_msa_missing}
          >
            <span>{rowData?.is_msa_missing === 1 ? "Yes" : "No"}</span>
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

  const [stateData, setStateData] = useState<any>();

  const onUpdate = (data: any) => {
    setStateData(data);
    switch (activeIndex) {
      case 0:
        updateCompanyMaster(data);
        break;
      case 1:
        updateCurrencyMaster(data);
        break;
      case 2:
        updateAccountsMaster(data);
        break;
      case 3:
        updateIndustryMaster(data);
        break;
      case 4:
        updateProductMaster(data);
        break;
      case 5:
        updateProjectMaster(data);
        break;
      case 6:
        updateTaxMaster(data);
        break;
      case 8:
        updateStateMaster(data);
        break;
      case 9:
        updateClientMaster(data);
        setOpenClientForm(true);
        break;
      default:
        break;
    }
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const CompanyFormFields = {
    companyName: {
      inputType: "inputtext",
      label: "Company Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    Website: {
      inputType: "inputtext",
      label: "Website",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    CINNO: {
      inputType: "inputtext",
      label: "CINNO",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    IECode: {
      inputType: "inputtext",
      label: "IECode",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    PAN: {
      inputType: "inputtext",
      label: "PAN",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    gst_number: {
      inputType: "inputtext",
      label: "GST",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    address: {
      inputType: "inputtext",
      label: "Address",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    Email: {
      inputType: "inputtext",
      label: "Email",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    description: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
  };

  const updateCompanyMaster = (data: any) => {
    try {
      CompanyFormFields.companyName.value = data?.companyName;
      CompanyFormFields.Website.value = data?.Website;
      CompanyFormFields.CINNO.value = data?.CINNO;
      CompanyFormFields.IECode.value = data?.IECode;
      CompanyFormFields.PAN.value = data?.PAN;
      CompanyFormFields.Email.value = data?.Email;
      CompanyFormFields.description.value = data?.description;
      setCompanyForm(_.cloneDeep(CompanyFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const CurrencyFormFields = {
    currencyName: {
      inputType: "inputtext",
      label: "Currency Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
    currencyDescription: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-12",
      row: 3,
    },
  };

  const updateCurrencyMaster = (data: any) => {
    try {
      CurrencyFormFields.currencyName.value = data?.currencyName;
      CurrencyFormFields.currencyDescription.value = data?.currencyDescription;
      setCurrencyForm(_.cloneDeep(CurrencyFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const AccountsFormFields = {
    companyName: {
      inputType: "singleSelect",
      label: "Company",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    account_type: {
      inputType: "singleSelect",
      label: "Account Type",
      options: ["Savings", "Current"],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    bank_name: {
      inputType: "inputtext",
      label: "Bank",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    bank_address: {
      inputType: "inputtext",
      label: "Bank Address",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    account_no: {
      inputType: "inputtext",
      label: "Account Number",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    ifsc_code: {
      inputType: "inputtext",
      label: "IFSC Code",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    micr_code: {
      inputType: "inputtext",
      label: "MICR Code",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
      rows: 3,
    },
    routing_no_swift_code: {
      inputType: "inputtext",
      label: "Swift Code",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
      rows: 3,
    },
    bank_code: {
      inputType: "inputtext",
      label: "Bank Code",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
      rows: 3,
    },
  };

  const updateAccountsMaster = (data: any) => {
    try {
      accountFieldsStructure.companyName.value = data?.company_name;
      accountFieldsStructure.account_type.value = data?.account_type;
      accountFieldsStructure.bank_name.value = data?.bank_name;
      accountFieldsStructure.bank_address.value = data?.bank_address;
      accountFieldsStructure.account_no.value = data?.account_no;
      accountFieldsStructure.account_no.value = data?.account_no;
      accountFieldsStructure.ifsc_code.value = data?.ifsc_code;
      accountFieldsStructure.micr_code.value = data?.micr_code;
      accountFieldsStructure.routing_no_swift_code.value =
        data?.routing_no_swift_code;
      accountFieldsStructure.bank_code.value = data?.bank_code;
      accountFieldsStructure.bank_code.value = data?.bank_code;
      setAccountForm(_.cloneDeep(accountFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const [accountFieldsStructure, setAccountFieldsStructure]: any =
    useState(AccountsFormFields);

  const IndustryFormFields = {
    industryName: {
      inputType: "inputtext",
      label: "Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    industryHead: {
      inputType: "inputtext",
      label: "Industry Head",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    description: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
  };

  const updateIndustryMaster = (data: any) => {
    try {
      IndustryFormFields.industryName.value = data?.industryName;
      IndustryFormFields.description.value = data?.description;
      IndustryFormFields.industryHead.value = data?.industryHead;
      setIndustryForm(_.cloneDeep(IndustryFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const ProductFormFields = {
    productName: {
      inputType: "inputtext",
      label: "Product Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
    productDescription: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
  };

  const updateProductMaster = (data: any) => {
    try {
      ProductFormFields.productName.value = data?.productName;
      ProductFormFields.productDescription.value = data?.productDescription;
      setProductForm(_.cloneDeep(ProductFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const ProjectFormFields = {
    projectName: {
      inputType: "inputtext",
      label: "Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
    projectDescription: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
  };

  const updateProjectMaster = (data: any) => {
    try {
      ProjectFormFields.projectName.value = data?.projectName;
      ProjectFormFields.projectDescription.value = data?.projectDescription;
      setProjectForm(_.cloneDeep(ProjectFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const TaxFormFields = {
    taxType: {
      inputType: "inputtext",
      label: "Type",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
    taxPercentage: {
      inputType: "inputtext",
      label: "Percentage",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
    effectiveDate: {
      inputType: "singleDatePicker",
      label: "Effective Date",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
  };

  const updateTaxMaster = (data: any) => {
    try {
      TaxFormFields.taxType.value = data?.taxType;
      TaxFormFields.taxPercentage.value = data?.taxPercentage;
      TaxFormFields.effectiveDate.value = data?.effectiveDate;
      setTaxForm(_.cloneDeep(TaxFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const StatesFormFields = {
    country_name: {
      inputType: "singleSelect",
      label: "Country",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    state_name: {
      inputType: "inputtext",
      label: "State",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    state_code: {
      inputType: "inputtext",
      label: "State Code",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
  };

  const updateStateMaster = (data: any) => {
    try {
      statesFieldsStructure.country_name.value = data?.country_name;
      statesFieldsStructure.state_name.value = data?.state_name;
      statesFieldsStructure.state_code.value = data?.state_code;

      setStatesForm(_.cloneDeep(statesFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const [statesFieldsStructure, setStatesFieldsStructure]: any =
    useState(StatesFormFields);

  const ClientFormFields = {
    industry_name: {
      inputType: "singleSelect",
      label: "Industry",
      options: [],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    name: {
      inputType: "inputtext",
      label: "Client Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    alias: {
      inputType: "inputtext",
      label: "Alias",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    pan_no: {
      inputType: "inputtext",
      label: "PAN Number",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    servicing_type: {
      inputType: "singleSelect",
      label: "Servicing Type",
      options: ["Domestic", "International"],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    client_category: {
      inputType: "inputtext",
      label: "Client Category",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    msa_start_date: {
      inputType: "singleDatePicker",
      label: "MSA Start Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    msa_end_date: {
      inputType: "singleDatePicker",
      label: "MSA End Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    is_msa_missing: {
      inputType: "inputSwitch",
      label: "MSA Missing?",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    msa_flag: {
      inputType: "inputSwitch",
      label: "Is NDA",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    non_solicitation_clause: {
      inputType: "inputSwitch",
      label: "Non Solicitation Clause",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    use_logo_permission: {
      inputType: "inputSwitch",
      label: "Use Logo Permission",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };

  const [clientFieldsStructure, setClientFieldsStructure]: any =
    useState(ClientFormFields);

  const ClientBillFormFields = {
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
    pin: {
      inputType: "inputtext",
      label: "PIN",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    country_name: {
      inputType: "singleSelect",
      label: "Country",
      options: [],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    state_name: {
      inputType: "singleSelect",
      label: "State",
      options: [],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    polestar_bank_account_number: {
      inputType: "singleSelect",
      label: "Polestar Bank Account Number",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    gstn: {
      inputType: "inputtext",
      label: "GSTN",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };

  const [clientBillFieldsStructure, setClientBillFieldsStructure]: any =
    useState(ClientBillFormFields);

  const ClientShipFormFields = {
    client_ship_to_address1: {
      inputType: "inputtext",
      label: "Address 1",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    client_ship_to_address2: {
      inputType: "inputtext",
      label: "Address 2",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    client_ship_to_address3: {
      inputType: "inputtext",
      label: "Address 3",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    client_ship_to_pin: {
      inputType: "inputtext",
      label: "PIN",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    client_ship_to_country_name: {
      inputType: "singleSelect",
      label: "Country",
      options: [],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    client_ship_to_state_name: {
      inputType: "singleSelect",
      label: "State",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    client_ship_to_gstn: {
      inputType: "inputtext",
      label: "GSTN",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };

  const [clientShipFieldsStructure, setClientShipFieldsStructure]: any =
    useState(ClientShipFormFields);

  const ClientContactFormFields = {
    salutation: {
      inputType: "singleSelect",
      label: "Salutation",
      options: ["Mr.", "Mrs.", "M/S"],
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
      },
      fieldWidth: "col-md-6",
    },
    phone: {
      inputType: "inputtext",
      label: "Phone Number",
      options: [],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };

  const updateClientMaster = (data: any) => {
    try {
      console.log('data', data);

      clientFieldsStructure.industry_name.value = data?.industry_name;
      clientFieldsStructure.name.value = data?.name;
      clientFieldsStructure.alias.value = data?.alias;
      clientFieldsStructure.pan_no.value = data?.pan_no;
      clientFieldsStructure.servicing_type.value = data?.servicing_type;
      clientFieldsStructure.client_category.value = data?.client_category;
      clientFieldsStructure.msa_start_date.value = data?.msa_start_date;
      clientFieldsStructure.msa_end_date.value = data?.msa_end_date;
      clientFieldsStructure.is_msa_missing.value = data?.is_msa_missing;
      clientFieldsStructure.msa_flag.value = data?.msa_flag;
      clientFieldsStructure.non_solicitation_clause.value = data?.non_solicitation_clause;
      clientFieldsStructure.use_logo_permission.value = data?.use_logo_permission;

      clientBillFieldsStructure.address1.value = data?.address1;
      clientBillFieldsStructure.address2.value = data?.address2;
      clientBillFieldsStructure.address3.value = data?.address3;
      clientBillFieldsStructure.pin.value = data?.pin;
      clientBillFieldsStructure.country_name.value = data?.country_name;
      clientBillFieldsStructure.state_name.value = data?.state_name;
      clientBillFieldsStructure.polestar_bank_account_number.value = data?.polestar_bank_account_number;
      clientBillFieldsStructure.gstn.value = data?.gstn;

      clientShipFieldsStructure.client_ship_to_address1.value = data?.client_ship_to_address1;
      clientShipFieldsStructure.client_ship_to_address2.value = data?.client_ship_to_address2;
      clientShipFieldsStructure.client_ship_to_address3.value = data?.client_ship_to_address3;
      clientShipFieldsStructure.client_ship_to_pin.value = data?.client_ship_to_pin;
      clientShipFieldsStructure.client_ship_to_country_name.value = data?.client_ship_to_country_name;
      clientShipFieldsStructure.client_ship_to_state_name.value = data?.client_ship_to_state_name;
      clientShipFieldsStructure.client_ship_to_gstn.value = data?.client_ship_to_gstn;

      ClientContactFormFields.salutation.value = data?.salutation;
      ClientContactFormFields.first_name.value = data?.first_name;
      ClientContactFormFields.last_name.value = data?.last_name;
      ClientContactFormFields.email.value = data?.email;
      ClientContactFormFields.phone.value = data?.phone;

      setClientFieldsStructure(_.cloneDeep(clientFieldsStructure));
      setClientBillFieldsStructure(_.cloneDeep(clientBillFieldsStructure));
      setClientShipFieldsStructure(_.cloneDeep(clientShipFieldsStructure));
      setClientContactForm(_.cloneDeep(ClientContactFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const [CompanyForm, setCompanyForm] = useState<any>(
    _.cloneDeep(CompanyFormFields)
  );

  const [CurrencyForm, setCurrencyForm] = useState<any>(
    _.cloneDeep(CurrencyFormFields)
  );

  const [AccountForm, setAccountForm] = useState<any>(
    _.cloneDeep(accountFieldsStructure)
  );

  const [IndustryForm, setIndustryForm] = useState<any>(
    _.cloneDeep(IndustryFormFields)
  );

  const [ProductForm, setProductForm] = useState<any>(
    _.cloneDeep(ProductFormFields)
  );

  const [ProjectForm, setProjectForm] = useState<any>(
    _.cloneDeep(ProjectFormFields)
  );

  const [TaxForm, setTaxForm] = useState<any>(_.cloneDeep(TaxFormFields));

  const [StatesForm, setStatesForm] = useState<any>(
    _.cloneDeep(statesFieldsStructure)
  );

  const [ClientForm, setClientForm] = useState<any>(
    _.cloneDeep(clientFieldsStructure)
  );

  const [ClientBillForm, setClientBillForm] = useState<any>(
    _.cloneDeep(clientBillFieldsStructure)
  );

  const [ClientShipForm, setClientShipForm] = useState<any>(
    _.cloneDeep(clientShipFieldsStructure)
  );

  const [ClientContactForm, setClientContactForm] = useState<any>(
    _.cloneDeep(ClientContactFormFields)
  );

  const closeFormPopup = () => {
    setFormPopup(false);
    setOpenClientForm(false);
    setCompanyForm(_.cloneDeep(CompanyFormFields));
    setCurrencyForm(_.cloneDeep(CurrencyFormFields));
    setAccountForm(_.cloneDeep(accountFieldsStructure));
    setIndustryForm(_.cloneDeep(IndustryFormFields));
    setProductForm(_.cloneDeep(ProductFormFields));
    setProjectForm(_.cloneDeep(ProjectFormFields));
    setTaxForm(_.cloneDeep(TaxFormFields));
    setStatesForm(_.cloneDeep(statesFieldsStructure));
    setClientForm(_.cloneDeep(clientFieldsStructure));
    setClientBillForm(_.cloneDeep(clientBillFieldsStructure));
    setClientShipForm(_.cloneDeep(clientShipFieldsStructure));
    setClientContactForm(_.cloneDeep(ClientContactFormFields));
    // setCountryForm(_.cloneDeep(CountryFormFields))
    setAttachments([]);
  };

  const companyFormHandler = async (form: FormType) => {
    setCompanyForm(form);
  };

  const currencyFormHandler = async (form: FormType) => {
    setCurrencyForm(form);
  };

  const accountsFormHandler = async (form: FormType) => {
    setAccountForm(form);
  };

  const industryFormHandler = async (form: FormType) => {
    setIndustryForm(form);
  };

  const productFormHandler = async (form: FormType) => {
    setProductForm(form);
  };

  const projectFormHandler = async (form: FormType) => {
    setProjectForm(form);
  };

  const taxFormHandler = async (form: FormType) => {
    setTaxForm(form);
  };

  const statesFormHandler = async (form: FormType) => {
    setStatesForm(form);
  };

  const clientFormHandler = async (form: FormType) => {
    setClientForm(form);
  };

  const clientBillFormHandler = async (form: FormType) => {
    setClientBillForm(form);
  };

  const clientShipFormHandler = async (form: FormType) => {
    setClientShipForm(form);
  };

  const clientContactFormHandler = async (form: FormType) => {
    setClientContactForm(form);
  };

  const createNewCompany = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(CompanyForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const formData: any = new FormData();

      const obj = {
        companyName: CompanyForm?.companyName?.value,
        Website: CompanyForm?.Website?.value,
        CINNO: CompanyForm?.CINNO?.value,
        IECode: CompanyForm?.IECode?.value,
        PAN: CompanyForm?.PAN?.value,
        Email: CompanyForm?.Email?.value,
        description: CompanyForm?.description?.value,
        gst_number: CompanyForm?.gst_number?.value,
        address: CompanyForm?.address?.value,
        isactive: 1,
        updatedBy: loggedInUserId,
      };

      Object.entries(obj).forEach(([key, value]: any) => {
        formData.set(key, value);
      });

      if (attachments?.length) {
        formData.set("file", attachments[0]);
      }

      if (!stateData?.id) {
        companyService
          .createCompanyMaster(formData)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getCompanyMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const formData: any = new FormData();
        const updatePayload = { ...obj, companyId: stateData?.id };

        Object.entries(updatePayload).forEach(([key, value]: any) => {
          formData.set(key, value);
        });

        if (attachments?.length) {
          formData.set("file", attachments[0]);
        }

        companyService
          .updateCompanyMaster(formData)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getCompanyMaster();
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

  const createNewCurrency = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(CurrencyForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const obj = {
        currencyName: CurrencyForm?.currencyName?.value,
        currencyDescription: CurrencyForm?.currencyDescription?.value,
        exchangeRate: CurrencyForm?.exchangeRate?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        currencyService
          .createCurrencyMaster(obj)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getCurrencyMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, currencyId: stateData?.id };

        currencyService
          .updateCurrencyMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getCurrencyMaster();
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

  const createNewAccount = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(AccountForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    const companyId =
      companyMaster.find(
        (company: any) => company.companyName === AccountForm.companyName.value
      )?.id ?? null;

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const obj = {
        companyId: companyId,
        accountType: AccountForm?.account_type?.value,
        bankName: AccountForm?.bank_name?.value,
        bankAddress: AccountForm?.bank_address?.value,
        accountNo: AccountForm?.account_no?.value,
        ifscCode: AccountForm?.ifsc_code?.value,
        micrCode: AccountForm?.micr_code?.value,
        routingNoSwiftCode: AccountForm?.routing_no_swift_code?.value,
        bankCode: AccountForm?.bank_code?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        accountsService
          .createAccountsMaster(obj)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getAccountsMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, accountId: stateData?.id };

        accountsService
          .updateAccountsMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getAccountsMaster();
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

  const createNewIndustry = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(IndustryForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const obj = {
        industryName: IndustryForm?.industryName?.value,
        description: IndustryForm?.description?.value,
        industryHead: IndustryForm?.industryHead?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        industryService
          .createIndustryMaster(obj)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getIndustryMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, industryId: stateData?.id };

        industryService
          .updateIndustryMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getIndustryMaster();
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

  const createNewProduct = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ProductForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const obj = {
        productName: ProductForm?.productName?.value,
        productDescription: ProductForm?.productDescription?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        productService
          .createProductMaster(obj)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getProductMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, productId: stateData?.id };

        productService
          .updateProductMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getProductMaster();
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

  const createNewProject = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ProjectForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const obj = {
        projectName: ProjectForm?.projectName?.value,
        projectDescription: ProjectForm?.projectDescription?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        projectService
          .createProjectMaster(obj)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getProjectMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, projectId: stateData?.id };

        projectService
          .updateProjectMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getProjectMaster();
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

  const createNewTax = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(TaxForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const obj = {
        taxType: TaxForm?.taxType?.value,
        taxPercentage: TaxForm?.taxPercentage?.value,
        effectiveDate: taxService.formatDate(TaxForm?.effectiveDate?.value),
        isactive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        taxService
          .createTaxMaster(obj)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getTaxMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, taxId: stateData?.id };

        taxService
          .updateTaxMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode == HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getTaxMaster();
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

  const createNewState = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(StatesForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    const countryId =
      countryMaster.find(
        (country: any) => country.name === StatesForm.country_name.value
      )?.id ?? null;

    if (companyValidityFlag) {
      const obj = {
        stateName: StatesForm?.state_name?.value,
        stateCode: StatesForm?.state_code?.value,
        countryId: countryId,
        isactive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.state_id) {
        stateService
          .createStateMaster(obj)
          .then((response: any) => {
            if (response?.statusCode === HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getStateMaster();
              ToasterService.show(response?.message, CONSTANTS.SUCCESS);
            }
          })
          .catch((error: any) => {
            setStateData({});
            ToasterService.show(error, CONSTANTS.ERROR);
          });
      } else {
        const updatePayload = { ...obj, stateId: stateData?.state_id };

        stateService
          .updateStateMaster(updatePayload)
          .then((response: any) => {
            if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getStateMaster();
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

  const creatClientForm = async (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ClientContactForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const industry_id =
        industryMaster.find(
          (industry: any) =>
            industry.industryName === ClientForm.industry_name.value
        )?.id ?? null;

      const countryId =
        countryMaster.find(
          (country: any) => country.name === ClientBillForm.country_name.value
        )?.id ?? null;

      const stateId =
        stateMaster.find(
          (state: any) => state.state_name === ClientBillForm.state_name.value
        )?.state_id ?? null;

      const polestar_bank_account_id =
        accountsMaster.find(
          (account: any) =>
            account.account_no ===
            ClientBillForm.polestar_bank_account_number.value
        )?.account_id ?? null;

      const client_ship_to_country_id =
        countryMaster.find(
          (country: any) =>
            country.name === ClientShipForm.client_ship_to_country_name.value
        )?.id ?? null;

      const client_ship_to_state_id =
        stateMaster.find(
          (state: any) =>
            state.state_name === ClientShipForm.client_ship_to_state_name.value
        )?.state_id ?? null;

      const formData: any = new FormData();

      const obj = {
        industry_id: industry_id,
        name: ClientForm?.name?.value,
        alias: ClientForm?.alias?.value,
        pan_no: ClientForm?.pan_no?.value,
        address1: ClientBillForm?.address1?.value,
        address2: ClientBillForm?.address2?.value,
        address3: ClientBillForm?.address3?.value,
        pin: ClientBillForm?.pin?.value,
        country_id: countryId,
        state_id: stateId,
        polestar_bank_account_id: polestar_bank_account_id,
        gstn: ClientBillForm?.gstn?.value,
        client_ship_to_address1: ClientShipForm?.client_ship_to_address1?.value,
        client_ship_to_address2: ClientShipForm?.client_ship_to_address2?.value,
        client_ship_to_address3: ClientShipForm?.client_ship_to_address3?.value,
        client_ship_to_pin: ClientShipForm?.client_ship_to_pin?.value,
        client_ship_to_gstn: ClientShipForm?.client_ship_to_gstn?.value,
        client_ship_to_country_id: client_ship_to_country_id,
        client_ship_to_state_id: client_ship_to_state_id,
        salutation: ClientContactForm?.salutation?.value,
        first_name: ClientContactForm?.first_name?.value,
        last_name: ClientContactForm?.last_name?.value,
        email: ClientContactForm?.email?.value,
        phone: ClientContactForm?.phone?.value,
        msa_flag: ClientForm?.msa_flag?.value ? 1 : 0,
        is_performa: ClientForm?.is_performa?.value ? 1 : 0,
        msa_start_date: await clientService.formatDate(ClientForm?.msa_start_date?.value),
        msa_end_date: await clientService.formatDate(ClientForm?.msa_end_date?.value),
        non_solicitation_clause: ClientForm?.non_solicitation_clause?.value
          ? 1
          : 0,
        use_logo_permission: ClientForm?.use_logo_permission?.value ? 1 : 0,
        client_category: ClientForm?.client_category?.value,
        servicing_type: ClientForm?.servicing_type?.value,
        missing_msa_deadline: ClientForm?.missing_msa_deadline?.value ? 1 : 0,
        is_msa_missing: ClientForm?.is_msa_missing?.value ? 1 : 0,
        updated_by: loggedInUserId,
      };

      Object.entries(obj).forEach(([key, value]: any) => {
        formData.set(key, value);
      });

      if (attachments?.length) {
        formData.set("file", attachments[0]);
      }

      console.log('stateData', stateData);
      
      if (!stateData?.id) {
        clientService
          .createClientMaster(formData)
          .then((response: any) => {
            if (response?.statusCode === HTTP_RESPONSE.CREATED) {
              setStateData({});
              closeFormPopup();
              getClientMaster();
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

        if (attachments?.length) {
          formData.set("file", attachments[0]);
        }

        clientService
          .updateClientMaster(formData)
          .then((response: any) => {
            if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
              setStateData({});
              closeFormPopup();
              getClientMaster();
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

  const moveNextClientForm = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ClientForm, (item: any) => {
      if (item?.validation?.required) {
        console.log("item", item, companyValidityFlag, item.valid);

        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });
    console.log("companyValidityFlag", companyValidityFlag);

    setIsFormValid(companyValidityFlag);
    if (companyValidityFlag) {
      setActiveClientIndex(activeClientIndex + 1);
    } else {
      ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
    }
  };

  const moveNextClientBillForm = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ClientBillForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);
    if (companyValidityFlag) {
      setActiveClientIndex(activeClientIndex + 1);
    } else {
      ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
    }
  };

  const moveNextClientShipForm = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ClientShipForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);
    if (companyValidityFlag) {
      setActiveClientIndex(activeClientIndex + 1);
    } else {
      ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
    }
  };

  const backToPreviousForm = () => {
    setActiveClientIndex(activeClientIndex - 1);
  };

  return loader ? (
    <Loader />
  ) : (
    <>
      <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
        <TabPanel header="Company">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New Company"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={companyMaster}
              column={CompanyTableColumns}
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
                    <h4 className="popup-heading">Add New Company</h4>
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
                    form={_.cloneDeep(CompanyForm)}
                    formUpdateEvent={companyFormHandler}
                    isFormValidFlag={isFormValid}
                  ></FormComponent>
                  {/* attachment */}
                  <div className={classes["upload-wrapper"]}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className={classes["upload-file-section"]}>
                          <div className={classes["upload-file"]}>
                            {attachments.length > 0 ? (
                              <div className={classes["image-preview"]}>
                                <img
                                  src={attachments[0].preview}
                                  alt="Preview"
                                />
                                <div className={classes["chip-tm"]}>
                                  {attachments.map(
                                    (
                                      item: { name: string | undefined },
                                      index: React.Key | null | undefined
                                    ) => (
                                      <Chip
                                        label={item.name}
                                        removable
                                        onRemove={() =>
                                          removeFileHandler(index)
                                        }
                                        key={index}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <input
                                  type="file"
                                  onClick={(event: any) => {
                                    event.target.value = null;
                                  }}
                                  onChange={(e) =>
                                    selectAttachment(e.target.files)
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
                  {/* attachment */}
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewCompany}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Currency">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New Currency"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={currencyMaster}
              column={CurrencyMasterColumns}
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
                    <h4 className="popup-heading">Add New Currency</h4>
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
                    form={_.cloneDeep(CurrencyForm)}
                    formUpdateEvent={currencyFormHandler}
                    isFormValidFlag={isFormValid}
                  ></FormComponent>
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewCurrency}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Accounts">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New Account"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={accountsMaster}
              column={AccountsMasterColumns}
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
                    <h4 className="popup-heading">Add New Account</h4>
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
                    form={_.cloneDeep(AccountForm)}
                    formUpdateEvent={accountsFormHandler}
                    isFormValidFlag={isFormValid}
                  />
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewAccount}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Industry">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New Industry"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={industryMaster}
              column={IndustryMasterColumns}
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
                    <h4 className="popup-heading">Add New Industry</h4>
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
                    form={_.cloneDeep(IndustryForm)}
                    formUpdateEvent={industryFormHandler}
                    isFormValidFlag={isFormValid}
                  ></FormComponent>
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewIndustry}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Product">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New Product"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={productsMaster}
              column={ProductsMasterColumns}
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
              />
            ) : null}
          </p>
          {storeFormPopup ? (
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
                    <h4 className="popup-heading">Add New Product</h4>
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
                    form={_.cloneDeep(ProductForm)}
                    formUpdateEvent={productFormHandler}
                    isFormValidFlag={isFormValid}
                  ></FormComponent>
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewProduct}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Project">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New Project"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={projectsMaster}
              column={ProjectsMasterColumns}
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
              />
            ) : null}
          </p>
          {storeFormPopup ? (
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
                    <h4 className="popup-heading">Add New Project</h4>
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
                    form={_.cloneDeep(ProjectForm)}
                    formUpdateEvent={projectFormHandler}
                    isFormValidFlag={isFormValid}
                  ></FormComponent>
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewProject}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Tax">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New Tax"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={taxMaster}
              column={TaxMasterColumns}
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
              />
            ) : null}
          </p>
          {storeFormPopup ? (
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
                    <h4 className="popup-heading">Add New Tax</h4>
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
                    form={_.cloneDeep(TaxForm)}
                    formUpdateEvent={taxFormHandler}
                    isFormValidFlag={isFormValid}
                  ></FormComponent>
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewTax}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Country">
          <p className="m-0">
            <DataTableBasicDemo
              data={countryMaster}
              column={CountryMasterColumns}
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
              />
            ) : null}
          </p>
        </TabPanel>
        <TabPanel header="States">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add New State"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={stateMaster}
              column={StateMasterColumns}
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
              />
            ) : null}
          </p>
          {storeFormPopup ? (
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
                    <h4 className="popup-heading">Add New State</h4>
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
                    form={_.cloneDeep(StatesForm)}
                    formUpdateEvent={statesFormHandler}
                    isFormValidFlag={isFormValid}
                  ></FormComponent>
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createNewState}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Client">
          {openClientForm ? (
            <TabView
              activeIndex={activeClientIndex}
              onTabChange={onClientTabChange}
            >
              <TabPanel header="Client">
                <div className={classes["form-container"]}>
                  <div className={classes["form-content"]}>
                    <FormComponent
                      form={_.cloneDeep(ClientForm)}
                      formUpdateEvent={clientFormHandler}
                      isFormValidFlag={isFormValid}
                    ></FormComponent>
                    {/* attachment */}
                    <div className={classes["upload-wrapper"]}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className={classes["upload-file-section"]}>
                            <div className={classes["upload-file"]}>
                              {attachments.length > 0 ? (
                                <div className={classes["image-preview"]}>
                                  <img
                                    src={attachments[0].preview}
                                    alt="Preview"
                                  />
                                  <div className={classes["chip-tm"]}>
                                    {attachments.map(
                                      (
                                        item: { name: string | undefined },
                                        index: React.Key | null | undefined
                                      ) => (
                                        <Chip
                                          label={item.name}
                                          removable
                                          onRemove={() =>
                                            removeFileHandler(index)
                                          }
                                          key={index}
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <input
                                    type="file"
                                    onClick={(event: any) => {
                                      event.target.value = null;
                                    }}
                                    onChange={(e) =>
                                      selectAttachment(e.target.files)
                                    }
                                    className={classes["upload"]}
                                  />
                                  <img
                                    src={ImageUrl.FolderIconImage}
                                    alt="Folder Icon"
                                  />
                                  <p>
                                    Drag files here <span> or browse</span>{" "}
                                    <br />
                                    <u>Support PNG</u>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* attachment */}
                  </div>
                </div>
                <div className={classes["popup-lower-btn"]}>
                  <ButtonComponent
                    label="Cancel"
                    icon="pi pi-check"
                    iconPos="right"
                    type="default"
                    submitEvent={closeClientForm}
                  />
                  <ButtonComponent
                    label="Next"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={moveNextClientForm}
                  />
                </div>
              </TabPanel>
              <TabPanel header="Client Bill To">
                <div className={classes["form-container"]}>
                  <div className={classes["form-content"]}>
                    <FormComponent
                      form={_.cloneDeep(ClientBillForm)}
                      formUpdateEvent={clientBillFormHandler}
                      isFormValidFlag={isFormValid}
                    ></FormComponent>
                  </div>
                </div>
                <div className={classes["popup-lower"]}>
                  <div className={classes["popup-lower-left-btn"]}>
                    <ButtonComponent
                      label="Back"
                      icon="pi pi-check"
                      iconPos="left"
                      type="default"
                      submitEvent={backToPreviousForm}
                    />
                  </div>
                  <div className={classes["popup-lower-right-btn"]}>
                    <ButtonComponent
                      label="Cancel"
                      icon="pi pi-check"
                      iconPos="right"
                      type="default"
                      submitEvent={closeClientForm}
                    />
                    <ButtonComponent
                      label="Next"
                      icon="pi pi-check"
                      iconPos="right"
                      submitEvent={moveNextClientBillForm}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Client Ship To">
                <div className={classes["form-container"]}>
                  <div className={classes["form-content"]}>
                    <FormComponent
                      form={_.cloneDeep(ClientShipForm)}
                      formUpdateEvent={clientShipFormHandler}
                      isFormValidFlag={isFormValid}
                    ></FormComponent>
                  </div>
                </div>
                <div className={classes["popup-lower"]}>
                  <div className={classes["popup-lower-left-btn"]}>
                    <ButtonComponent
                      label="Back"
                      icon="pi pi-check"
                      iconPos="left"
                      type="default"
                      submitEvent={backToPreviousForm}
                    />
                  </div>
                  <div className={classes["popup-lower-right-btn"]}>
                    <ButtonComponent
                      label="Cancel"
                      icon="pi pi-check"
                      iconPos="right"
                      type="default"
                      submitEvent={closeClientForm}
                    />
                    <ButtonComponent
                      label="Next"
                      icon="pi pi-check"
                      iconPos="right"
                      submitEvent={moveNextClientShipForm}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Contact">
                <div className={classes["form-container"]}>
                  <div className={classes["form-content"]}>
                    <FormComponent
                      form={_.cloneDeep(ClientContactForm)}
                      formUpdateEvent={clientContactFormHandler}
                      isFormValidFlag={isFormValid}
                    ></FormComponent>
                  </div>
                </div>
                <div className={classes["popup-lower"]}>
                  <div className={classes["popup-lower-left-btn"]}>
                    <ButtonComponent
                      label="Back"
                      icon="pi pi-check"
                      iconPos="left"
                      type="default"
                      submitEvent={backToPreviousForm}
                    />
                  </div>
                  <div className={classes["popup-lower-right-btn"]}>
                    <ButtonComponent
                      label="Cancel"
                      icon="pi pi-check"
                      iconPos="right"
                      type="default"
                      submitEvent={closeClientForm}
                    />
                    <ButtonComponent
                      label="Submit Form"
                      icon="pi pi-check"
                      iconPos="right"
                      submitEvent={creatClientForm}
                    />
                  </div>
                </div>
              </TabPanel>
            </TabView>
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
                  label="New Client"
                  icon="pi pi-check"
                  iconPos="right"
                  submitEvent={openClientFormButton}
                />
              </div>
              <p className="m-0">
                <DataTableBasicDemo
                  data={clientMaster}
                  column={ClientMasterColumns}
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
                  />
                ) : null}
              </p>
            </>
          )}
        </TabPanel>
      </TabView>
    </>
  );
};

export default Master;