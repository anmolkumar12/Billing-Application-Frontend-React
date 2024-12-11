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
import classes from "../aggregator-analytics/AggregatorAnalytics.module.scss";
import _ from "lodash";
import { FormType } from "../../schemas/FormField";
import { AuthService } from "../../services/auth-service/auth.service";
import { FILE_TYPES } from "../../enums/file-types.enum";
import { ImageUrl } from "../../utils/ImageUrl";
import { Chip } from "primereact/chip";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";

const Master: React.FC = () => {
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const [currencyMaster, setCurrencyMaster] = useState([]);
  const [industryMaster, setIndustryMaster] = useState([]);
  const [accountsMaster, setAccountsMaster] = useState([]);
  const [productsMaster, setProductsMaster] = useState([]);
  const [projectsMaster, setProjectsMaster] = useState([]);
  const [taxMaster, setTaxMaster] = useState([]);
  const [countryMaster, setCountryMaster] = useState([]);
  const [stateMaster, setStateMaster] = useState([]);
  const [clientMaster, setClientMaster] = useState([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [openClientForm, setClientForm] = useState(false);
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
    switch (activeIndex) {
      case 0:
        getCompanyMaster();
        break;
      case 1:
        getCurrencyMaster();
        break;
      case 2:
        getAccountsMaster();
        getCompanyMaster();
        formatCompanyDetails();
        break;
      case 3:
        getIndustryMaster();
        break;
      case 4:
        getProductMaster();
        break;
      case 5:
        getProjectMaster();
        break;
      case 6:
        getTaxMaster();
        break;
      case 7:
        getCountryMaster();
        break;
      case 8:
        getStateMaster();
        break;
      case 9:
        getClientMaster();
        break;
      default:
        break;
    }
  }, [activeIndex]);

  const onTabChange = (e: any) => {
    setActiveIndex(e.index);
  };

  const formatCompanyDetails = () => {
    const companyList = companyMaster.map(
      (company: any) => company?.companyName
    );

    accountFieldsStructure.companyName.options = companyList;
    setAccountFieldsStructure(accountFieldsStructure);
    accountsFormHandler(accountFieldsStructure);
  };

  const getCompanyMaster = () => {
    setLoader(true);
    companyService
      .getCompanyMaster()
      .then((response: any) => {
        setLoader(false);
        setCompanyMaster(response?.companies);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getCurrencyMaster = () => {
    setLoader(true);
    currencyService
      .getCurrencyMaster()
      .then((response: any) => {
        setLoader(false);
        setCurrencyMaster(response?.currencies);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getIndustryMaster = () => {
    setLoader(true);
    industryService
      .getIndustryMaster()
      .then((response: any) => {
        setLoader(false);
        setIndustryMaster(response?.industries);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getAccountsMaster = () => {
    setLoader(true);
    accountsService
      .getAccountsMaster()
      .then((response: any) => {
        setLoader(false);
        setAccountsMaster(response?.accounts);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getProductMaster = () => {
    setLoader(true);
    productService
      .getProductMaster()
      .then((response: any) => {
        setLoader(false);
        setProductsMaster(response?.products);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getProjectMaster = () => {
    setLoader(true);
    projectService
      .getProjectMaster()
      .then((response: any) => {
        setLoader(false);
        setProjectsMaster(response?.projects);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getTaxMaster = () => {
    setLoader(true);
    taxService
      .getTaxMaster()
      .then((response: any) => {
        setLoader(false);
        setTaxMaster(response?.taxes);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getCountryMaster = () => {
    setLoader(true);
    countryService
      .getCountryMaster()
      .then((response: any) => {
        setLoader(false);
        setCountryMaster(response?.countries);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getStateMaster = () => {
    setLoader(true);
    stateService
      .getStateMaster()
      .then((response: any) => {
        setLoader(false);
        setStateMaster(response?.states);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const getClientMaster = () => {
    setLoader(true);
    clientService
      .getClientMaster()
      .then((response: any) => {
        setLoader(false);
        setClientMaster(response?.clients);
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
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

  const openSaveForm = () => {
    setFormPopup(true);
  };

  const openClientFormButton = () => {
    setClientForm(true);
  };

  const selectAttachment = (files: any) => {
    setAttachments([]);
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          eventList.name
            .split(".")
            [eventList.name.split(".").length - 1].toLowerCase() ==
          FILE_TYPES.PDF
        ) {
          if (eventList.size > 10485760) {
            return ToasterService.show(
              "file size is too large, allowed maximum size is 10 MB.",
              "error"
            );
          } else {
            setAttachments((prevVals: any) => [...prevVals, eventList]);
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
          {rowData.isactive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Company Name",
      fieldName: "companyName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "companyName",
      changeFilter: true,
      placeholder: "Company Name",
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
      label: "Logo Path",
      fieldName: "logopath",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.logopath}
          >
            {rowData.logopath}
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
          {rowData.isActive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Currency Name",
      fieldName: "currencyName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "currencyName",
      changeFilter: true,
      placeholder: "Currency Name",
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
      label: "Currency Description",
      fieldName: "currencyDescription",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "currencyDescription",
      changeFilter: true,
      placeholder: "Currency Description",
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
      label: "Exchange Rate",
      fieldName: "exchangeRate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "exchangeRate",
      changeFilter: true,
      placeholder: "Exchange Rate",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.exchangeRate}
          >
            {rowData.exchangeRate}
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
          {rowData.isActive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Industry Name",
      fieldName: "industryName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryName",
      changeFilter: true,
      placeholder: "Industry Name",
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
          {rowData.is_active ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Company Name",
      fieldName: "company_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "company_name",
      changeFilter: true,
      placeholder: "Company Name",
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
      label: "Bank Name",
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
          {rowData.isActive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Product Name",
      fieldName: "productName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "productName",
      changeFilter: true,
      placeholder: "Product Name",
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
      label: "Product Description",
      fieldName: "productDescription",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "productDescription",
      changeFilter: true,
      placeholder: "Product Description",
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
          {rowData.isActive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Project Name",
      fieldName: "projectName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "projectName",
      changeFilter: true,
      placeholder: "Project Name",
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
      label: "Project Description",
      fieldName: "projectDescription",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "projectDescription",
      changeFilter: true,
      placeholder: "Project Description",
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
          {rowData.isActive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Tax Type",
      fieldName: "taxType",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "taxType",
      changeFilter: true,
      placeholder: "Tax Type",
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
      label: "Tax Percentage",
      fieldName: "taxPercentage",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "taxPercentage",
      changeFilter: true,
      placeholder: "Tax Percentage",
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
    {
      label: "Country Name",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Country Name",
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
          ></span>
          {rowData.isActive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
            ></span>
          ) : null}
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
      label: "Country Name",
      fieldName: "country_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "country_name",
      changeFilter: true,
      placeholder: "Country Name",
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
          {rowData.isactive ? (
            <span
              className="pi pi-trash"
              style={{ cursor: "pointer" }}
              title="Deactivate"
              onClick={() => onDelete(rowData)}
            ></span>
          ) : null}
        </div>
      ),
    },
    {
      label: "Company Name",
      fieldName: "company_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "company_name",
      changeFilter: true,
      placeholder: "Company Name",
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
      label: "Country Name",
      fieldName: "country_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "country_name",
      changeFilter: true,
      placeholder: "Country Name",
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
      label: "Shipping Country Name",
      fieldName: "client_ship_to_country_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_country_name",
      changeFilter: true,
      placeholder: "Shipping Country Name",
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
      label: "Shipping State Name",
      fieldName: "client_ship_to_state_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_ship_to_state_name",
      changeFilter: true,
      placeholder: "Shipping State Name",
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
            <span>
              {rowData?.msa_flag === 1 ? "Yes" : "No"}
            </span>
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Is Performa",
      fieldName: "is_performa",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "is_performa",
      changeFilter: true,
      placeholder: "Is Performa",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.is_performa}
          >
            <span>
              {rowData?.is_performa === 1 ? "Yes" : "No"}
            </span>
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
            <span>
              {rowData?.non_solicitation_clause === 1 ? "Yes" : "No"}
            </span>
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
            <span>
              {rowData?.use_logo_permission === 1 ? "Yes" : "No"}
            </span>
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
            <span>
              {rowData?.missing_msa_deadline === 1 ? "Yes" : "No"}
            </span>
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Is MSA Missing",
      fieldName: "is_msa_missing",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "is_msa_missing",
      changeFilter: true,
      placeholder: "Is MSA Missing",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.is_msa_missing}
          >
            <span>
              {rowData?.is_msa_missing === 1 ? "Yes" : "No"}
            </span>
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Logopath",
      fieldName: "logopath",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "logopath",
      changeFilter: true,
      placeholder: "Logopath",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            data-pr-tooltip={rowData.logopath}
          >
            {rowData.logopath}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
  ];

  const onDelete = (data: unknown) => {
    patchData = data;
    setActionPopupToggle({
      displayToggle: false,
      title: "Delete",
      message: "Are you sure you want to deactivate this record",
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
        // minlength: 2,
        // maxlength: 10,
      },
      fieldWidth: "col-md-6",
    },
    IECode: {
      inputType: "inputtext",
      label: "IECode",
      value: null,
      validation: {
        required: true,
        // minlength: 2,
        // maxlength: 100,
      },
      fieldWidth: "col-md-6",
    },
    PAN: {
      inputType: "inputtext",
      label: "PAN",
      value: null,
      validation: {
        required: true,
        // minlength: 2,
        // maxlength: 100,
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
        required: true,
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
      label: "Currency Description",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
      row: 3,
    },
    exchangeRate: {
      inputType: "inputtext",
      label: "Exchange Rate",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
  };

  const updateCurrencyMaster = (data: any) => {
    try {
      CurrencyFormFields.currencyName.value = data?.currencyName;
      CurrencyFormFields.currencyDescription.value = data?.currencyDescription;
      CurrencyFormFields.exchangeRate.value = data?.exchangeRate;
      setCurrencyForm(_.cloneDeep(CurrencyFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const AccountsFormFields = {
    companyName: {
      inputType: "singleSelect",
      label: "Company Name",
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
      options: ["Domestic", "International"],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    bank_name: {
      inputType: "inputtext",
      label: "Bank Name",
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
        required: true,
      },
      fieldWidth: "col-md-6",
      rows: 3,
    },
    routing_no_swift_code: {
      inputType: "inputtext",
      label: "Swift Code",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
      rows: 3,
    },
    bank_code: {
      inputType: "inputtext",
      label: "Bank Code",
      value: null,
      validation: {
        required: true,
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
      label: "Industry Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
    description: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
    industryHead: {
      inputType: "inputtext",
      label: "Industry Head",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
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
      label: "Product Description",
      value: null,
      validation: {
        required: true,
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
      label: "Project Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
    projectDescription: {
      inputType: "inputtextarea",
      label: "Project Description",
      value: null,
      validation: {
        required: true,
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
      label: "Tax Type",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    taxPercentage: {
      inputType: "inputtext",
      label: "Tax Percentage",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    effectiveDate: {
      inputType: "singleDatePicker",
      label: "Effective Date",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
  };

  const updateTaxMaster = (data: any) => {
    try {
      console.log("data", data);
      TaxFormFields.taxType.value = data?.taxType;
      TaxFormFields.taxPercentage.value = data?.taxPercentage;
      TaxFormFields.effectiveDate.value = data?.effectiveDate;
      setTaxForm(_.cloneDeep(TaxFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  // const CountryFormFields = {
  //   code: {
  //     inputType: 'inputtext',
  //     label: 'Country Code',
  //     value: null,
  //     validation: {
  //       required: true,
  //     },
  //     fieldWidth: 'col-md-6',
  //   },
  //   currency: {
  //     inputType: 'inputtext',
  //     label: 'Currency',
  //     value: null,
  //     validation: {
  //       required: true,
  //     },
  //     fieldWidth: 'col-md-6',
  //   },
  //   name: {
  //     inputType: 'inputtext',
  //     label: 'Currency Name',
  //     value: null,
  //     validation: {
  //       required: true,
  //     },
  //     fieldWidth: 'col-md-6',
  //   },
  //   language: {
  //     inputType: 'inputtext',
  //     label: 'Language',
  //     value: null,
  //     validation: {
  //       required: true,
  //     },
  //     fieldWidth: 'col-md-6',
  //   },
  //   phone_code: {
  //     inputType: 'inputtext',
  //     label: 'Phone Code',
  //     value: null,
  //     validation: {
  //       required: true,
  //     },
  //     fieldWidth: 'col-md-6',
  //   },
  // }

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

  // const [CountryForm, setCountryForm] = useState<any>(
  //   _.cloneDeep(CountryFormFields)
  // )

  const [TaxForm, setTaxForm] = useState<any>(_.cloneDeep(TaxFormFields));

  const closeFormPopup = () => {
    setFormPopup(false);
    setCompanyForm(_.cloneDeep(CompanyFormFields));
    setCurrencyForm(_.cloneDeep(CurrencyFormFields));
    setAccountForm(_.cloneDeep(accountFieldsStructure));
    setIndustryForm(_.cloneDeep(IndustryFormFields));
    setProductForm(_.cloneDeep(ProductFormFields));
    setProjectForm(_.cloneDeep(ProjectFormFields));
    setTaxForm(_.cloneDeep(TaxFormFields));
    // setCountryForm(_.cloneDeep(CountryFormFields))
    setAttachments([]);
  };

  const companyFormHandler = (form: FormType) => {
    setCompanyForm(form);
  };

  const currencyFormHandler = (form: FormType) => {
    setCurrencyForm(form);
  };

  const accountsFormHandler = (form: FormType) => {
    setAccountForm(form);
  };

  const industryFormHandler = (form: FormType) => {
    setIndustryForm(form);
  };

  const productFormHandler = (form: FormType) => {
    setProductForm(form);
  };

  const projectFormHandler = (form: FormType) => {
    setProjectForm(form);
  };

  const taxFormHandler = (form: FormType) => {
    setTaxForm(form);
  };

  // const countryFormHandler = (form: FormType) => {
  //   setCountryForm(form)
  // }

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
        effectiveDate: TaxForm?.effectiveDate?.value,
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

  // const createNewCountry = (event: FormEvent) => {
  //   event.preventDefault()
  //   let companyValidityFlag = true
  //   const companyFormValid: boolean[] = []

  //   _.each(CountryForm, (item: any) => {
  //     if (item?.validation?.required) {
  //       companyFormValid.push(item.valid)
  //       companyValidityFlag = companyValidityFlag && item.valid
  //     }
  //   })

  //   setIsFormValid(companyValidityFlag)

  //   if (companyValidityFlag) {
  //     const obj = {
  //       code: CountryForm?.code?.value,
  //       currency: CountryForm?.currency?.value,
  //       name: CountryForm?.name?.value,
  //       language: CountryForm?.language?.value,
  //       phone_code: CountryForm?.phone_code?.value,
  //       isactive: 1,
  //       updatedBy: loggedInUserId,
  //     }

  //     taxService
  //       .createTaxMaster(obj)
  //       .then((response: any) => {
  //         if (response?.statusCode == HTTP_RESPONSE.CREATED) {
  //           closeFormPopup()
  //           getTaxMaster()
  //           ToasterService.show(response?.message, CONSTANTS.SUCCESS)
  //         }
  //       })
  //       .catch((error: any) => {
  //         ToasterService.show(error, CONSTANTS.ERROR)
  //       })
  //   } else {
  //     ToasterService.show('Please Check all the Fields!', CONSTANTS.ERROR)
  //   }
  // }

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
              label="New Company"
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
                    <h4 className="popup-heading">Add New Company Form</h4>
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
                            <input
                              type="file"
                              onClick={(event: any) => {
                                event.target.value = null;
                              }}
                              onChange={(e) => selectAttachment(e.target.files)}
                              className={classes["upload"]}
                            />
                            <img src={ImageUrl.FolderIconImage} />
                            <p>
                              Drag files here <span> or browse</span> <br />
                              <u>Support PDF</u>
                            </p>
                            <div className={classes["chip-tm"]}>
                              {attachments?.length
                                ? attachments.map((item: any, index: any) => {
                                    return (
                                      <Chip
                                        label={item?.name}
                                        removable
                                        onRemove={() => removeFileHandler()}
                                        key={index}
                                      />
                                    );
                                  })
                                : null}
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
              label="New Currency"
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
                    <h4 className="popup-heading">Add New Currency Form</h4>
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
              label="New Account"
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
                    <h4 className="popup-heading">Add New Account Form</h4>
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
              label="New Industry"
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
                    <h4 className="popup-heading">Add New Industry Form</h4>
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
              label="New Product"
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
                    <h4 className="popup-heading">Add New Product Form</h4>
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
              label="New Project"
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
                    <h4 className="popup-heading">Add New Project Form</h4>
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
              label="New Tax"
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
                    <h4 className="popup-heading">Add New Tax Form</h4>
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
              label="New States"
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
                    <h4 className="popup-heading">Add New States Form</h4>
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
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={activeIndex}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Client">
          {openClientForm ? (
            <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
              <TabPanel header="Client">
                {/* <FormComponent
                  form={_.cloneDeep(ClientForm)}
                  formUpdateEvent={clientFormHandler}
                  isFormValidFlag={isFormValid}
                ></FormComponent> */}

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={activeIndex}
                  />
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={activeIndex}
                  />
                </div>
              </TabPanel>
              <TabPanel header="Client Bill To">
                <FormComponent
                  form={_.cloneDeep(CompanyForm)}
                  formUpdateEvent={companyFormHandler}
                  isFormValidFlag={isFormValid}
                ></FormComponent>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={activeIndex}
                  />
                </div>
              </TabPanel>
              <TabPanel header="Client Ship To">
                <FormComponent
                  form={_.cloneDeep(CompanyForm)}
                  formUpdateEvent={companyFormHandler}
                  isFormValidFlag={isFormValid}
                ></FormComponent>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={activeIndex}
                  />
                </div>
              </TabPanel>
              <TabPanel header="Contact">
                <FormComponent
                  form={_.cloneDeep(CompanyForm)}
                  formUpdateEvent={companyFormHandler}
                  isFormValidFlag={isFormValid}
                ></FormComponent>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={activeIndex}
                  />
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