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
import FormComponent from "../../components/ui/form/form";
import classes from "./Master.module.scss";
import _ from "lodash";
import { FormType } from "../../schemas/FormField";
import { AuthService } from "../../services/auth-service/auth.service";
import { FILE_TYPES } from "../../enums/file-types.enum";
import { ImageUrl } from "../../utils/ImageUrl";
import { Chip } from "primereact/chip";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";
import Cookies from "universal-cookie";
import { TechnologyMasterService } from "../../services/masters/technology-master/technology.service";
import CountryMaster from "./CountryMaster";
import StateMaster from "./StateMaster";
import RegionMaster from "./RegionMaster";
import CompanyMaster from "./CompanyMaster";
import CompanyAddressMaster from "./CompanyAddressMaster";
import AccountTypeMaster from "./AccountTypeMaster";
import AccountMaster from "./AccountMaster";
import ProductionTypeMaster from "./ProductionTypeMaster";
import IndustryMaster from "./IndustryMaster";
import IndustryGroupMaster from "./IndustryGroupMaster";
import IndustryHeadMaster from "./IndustryHeadMaster";
import SalesMaster from "./SalesManagerMaster";
import AccountManagerMaster from "./AccountManagerMaster";
import TechGroupMaster from "./TechGroupMaster";
import TechSubGroupMaster from "./TechSubGroupMaster";
import TechMaster from "./TechMaster";
import OemMaster from "./OemMaster";
import PolestarProductSalesMaster from "./PolestarProductSalesMaster";
import ProjectServiceMaster from "./ProjectServiceMaster";

const Master: React.FC = () => {
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const [companyLocationMaster, setCompanyLocationMaster] = useState<any>([]);
  const [currencyMaster, setCurrencyMaster] = useState([]);
  const [industryMaster, setIndustryMaster] = useState<any>([]);
  const [accountsMaster, setAccountsMaster] = useState<any>([]);
  const [technologyMaster, setTechnologyMaster] = useState([]);
  const [productsMaster, setProductsMaster] = useState([]);
  const [projectsMaster, setProjectsMaster] = useState([]);
  const [taxMaster, setTaxMaster] = useState([]);
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [stateMaster, setStateMaster] = useState<any>([]);
  const [clientMaster, setClientMaster] = useState<any>([]);
  const [clientBillToMaster, setClientBillToMaster] = useState<any>([]);
  const [clientShipToMaster, setClientShipToMaster] = useState<any>([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeClientIndex, setActiveClientIndex] = useState(0);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [openClientForm, setOpenClientForm] = useState(false);
  const [attachments, setAttachments]: any = useState([]);
  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;

  let patchData: any;

  const companyService = new CompanyMasterService();
  const currencyService = new CurrencyMasterService();
  const industryService = new IndustryMasterService();
  const accountsService = new AccountsMasterService();
  const technologyService = new TechnologyMasterService();
  const productService = new ProductMasterService();
  const projectService = new ProjectMasterService();
  const taxService = new TaxMasterService();
  const countryService = new CountryMasterService();
  const stateService = new StateMasterService();
  const clientService = new ClientMasterService();

  useEffect(() => {
    let companies: any = [];
    let companyAddresses: any = [];
    let countries: any = [];
    let states: any = [];
    let clients: any = [];
    const fetchData = async () => {
      switch (activeIndex) {
        case 0:
          countries = await getCountryMaster();
          // companies = await getCompanyMaster();
          break;
        case 1:
          companyAddresses = await getCompanyLocationMaster();
          companies = await getCompanyMaster();
          countries = await getCountryMaster();
          states = await getStateMaster();
          await formatCompanyDetails(companies);
          await formatCountry_ClientDetails(countries);
          await formatState_ClientDetails(states);
          break;
        case 2:
          await getCurrencyMaster();
          break;
        case 3:
          await getAccountsMaster();
          companies = await getCompanyMaster();
          await formatCompanyDetails(companies);
          break;
        case 4:
          await getIndustryMaster();
          break;
        case 5:
          await getTechnologyMaster();
          break;
        case 6:
          await getProductMaster();
          break;
        case 7:
          await getProjectMaster();
          break;
        case 8:
          await getTaxMaster();
          break;
        case 9:
          // countries = await getCountryMaster();
          break;
        case 10:
          await getStateMaster();
          countries = await getCountryMaster();
          await formatCountry_StateDetails(countries);
          break;
        case 11:
          setOpenClientForm(false);
          setActiveClientIndex(0);
          clients = await getClientMaster();
          await getIndustryMaster();
          await getAccountsMaster();
          await formatIndustry_ClientDetails();
          await formatAccount_ClientDetails();
          break;
        case 12:
          await getClientBillToMaster();
          clients = await getClientMaster();
          countries = await getCountryMaster();
          states = await getStateMaster();
          await formatCountry_ClientDetails(countries);
          await formatState_ClientDetails(states);
          await formatClient_BillDetails(clients);
          break;
        case 13:
          await getClientShipToMaster();
          clients = await getClientMaster();
          countries = await getCountryMaster();
          states = await getStateMaster();
          await formatCountry_Client_ShipDetails(countries);
          await formatState_Client_ShipDetails(states);
          await formatClient_ShipDetails(clients);
          break;
        default:
          break;
      }
    };
    if (
      storeFormPopup == false &&
      openClientForm == false &&
      showConfirmDialogue == false
    ) {
      // fetchData();
    }
  }, [activeIndex, storeFormPopup, openClientForm, showConfirmDialogue]);

  const onTabChange = (e: any) => {
    setActiveIndex(e.index);
  };

  const onClientTabChange = (e: any) => {
    setActiveClientIndex(e.index);
  };

  const formatCompanyDetails = async (companies: any = companyMaster) => {
    const companyList = companies?.map((company: any) => company?.companyName);
    switch (activeIndex) {
      case 1:
        companyLocationFieldsStructure.companyName.options = companyList;
        await setCompanyLocationFieldsStructure(companyLocationFieldsStructure);
        await companyLocationFormHandler(companyLocationFieldsStructure);
        break;
      case 3:
        accountFieldsStructure.companyName.options = companyList;
        await setAccountFieldsStructure(accountFieldsStructure);
        await accountsFormHandler(accountFieldsStructure);
        break;
      default:
        break;
    }
  };

  const formatIndustry_ClientDetails = async () => {
    const industryList = industryMaster.map(
      (industry: any) => industry?.industryName
    );
    clientFieldsStructure.industry_name.options = industryList;
    await setClientFieldsStructure(clientFieldsStructure);
    await clientFormHandler(clientFieldsStructure);
  };

  const formatCountry_ClientDetails = async (
    countries: any = countryMaster
  ) => {
    const countrylist = countries.map((country: any) => country?.name);
    switch (activeIndex) {
      case 1:
        companyLocationFieldsStructure.country_name.options = countrylist;
        await setCompanyLocationFieldsStructure(companyLocationFieldsStructure);
        await companyLocationFormHandler(companyLocationFieldsStructure);
        break;
      case 12:
        clientBillFieldsStructure.country_name.options = countrylist;
        await setClientBillFieldsStructure(clientBillFieldsStructure);
        await clientBillFormHandler(clientBillFieldsStructure);
        break;
      default:
        break;
    }
  };

  const formatState_ClientDetails = async (states: any = stateMaster) => {
    const statelist = states.map((state: any) => state.state_name);
    switch (activeIndex) {
      case 1:
        companyLocationFieldsStructure.state_name.options = statelist;
        await setCompanyLocationFieldsStructure(companyLocationFieldsStructure);
        await companyLocationFormHandler(companyLocationFieldsStructure);
        break;
      case 12:
        clientBillFieldsStructure.state_name.options = statelist;
        await setClientBillFieldsStructure(clientBillFieldsStructure);
        await clientBillFormHandler(clientBillFieldsStructure);
        break;
      default:
        break;
    }
  };

  const formatCountry_StateDetails = async (countries: any = countryMaster) => {
    const countrylist = countries.map((country: any) => country?.name);
    statesFieldsStructure.country_name.options = countrylist;
    await setStatesFieldsStructure(statesFieldsStructure);
    await statesFormHandler(statesFieldsStructure);
  };

  const formatAccount_ClientDetails = async () => {
    const accountslist = accountsMaster.map(
      (account: any) => account?.account_no
    );

    clientFieldsStructure.polestar_bank_account_number.options = accountslist;
    await setClientFieldsStructure(clientFieldsStructure);
    await clientFormHandler(clientFieldsStructure);
  };

  const formatCountry_Client_ShipDetails = async (
    countries: any = countryMaster
  ) => {
    const countrylist = countries.map((country: any) => country?.name);
    clientShipFieldsStructure.client_ship_to_country_name.options = countrylist;
    await setClientShipFieldsStructure(clientShipFieldsStructure);
    await clientShipFormHandler(clientShipFieldsStructure);
  };

  const formatState_Client_ShipDetails = async (states: any = stateMaster) => {
    const statelist = states.map((state: any) => state?.state_name);
    clientShipFieldsStructure.client_ship_to_state_name.options = statelist;
    await setClientShipFieldsStructure(clientShipFieldsStructure);
    await clientShipFormHandler(clientShipFieldsStructure);
  };

  const formatClient_BillDetails = async (clients: any = clientMaster) => {
    const clientlist = clients.map((client: any) => client?.name);

    clientBillFieldsStructure.client_name.options = clientlist;
    await setClientBillFieldsStructure(clientBillFieldsStructure);
    await clientBillFormHandler(clientBillFieldsStructure);
  };

  const formatClient_ShipDetails = async (clients: any = clientMaster) => {
    const clientlist = clients.map((client: any) => client?.name);

    clientShipFieldsStructure.client_name.options = clientlist;
    await setClientShipFieldsStructure(clientShipFieldsStructure);
    await clientShipFormHandler(clientShipFieldsStructure);
  };

  const getCompanyMaster = async () => {
    setLoader(true);
    try {
      const response = await companyService.getCompanyMaster();
      setCompanyMaster(response?.companies);
      return response?.companies;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getCompanyLocationMaster = async () => {
    setLoader(true);
    try {
      const response = await companyService.getCompanyLocationMaster();
      setCompanyLocationMaster(response?.addresses);
      return response?.addresses;
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
      return response?.currencies;
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
      return response?.industries;
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
      return response?.accounts;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getTechnologyMaster = async () => {
    setLoader(true);
    try {
      const response = await technologyService.getTechnologyMaster();
      setTechnologyMaster(response?.technologies);
      return response?.technologies;
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
      return response?.products;
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
      return response?.projects;
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
      return response?.taxes;
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
      return response?.countries;
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

  const getClientBillToMaster = async () => {
    setLoader(true);
    try {
      const response = await clientService.getClientBillToMaster();
      setClientBillToMaster(response?.billingInfo);
      return response?.billingInfo;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getClientShipToMaster = async () => {
    setLoader(true);
    try {
      const response = await clientService.getClientShipToMaster();
      setClientShipToMaster(response?.shippingInfo);
      return response?.shippingInfo;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const deactivateCompanyMaster = () => {
    setLoader(true);
    companyService
      .deactivateCompanyMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Company record ${
            patchData?.isactive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateCompanyLocationMaster = () => {
    setLoader(true);
    companyService
      .deactivateCompanyLocationMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Company record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateCurrencyMaster = () => {
    setLoader(true);
    currencyService
      .deactivateCurrencyMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Currency record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateIndustryMaster = () => {
    setLoader(true);
    industryService
      .deactivateIndustryMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Industry record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateAccountsMaster = () => {
    setLoader(true);
    accountsService
      .deactivateAccountsMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Accounts record ${
            patchData?.is_active ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateTechnologyMaster = () => {
    setLoader(true);
    technologyService
      .deactivateTechnologyMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Technology record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateProductMaster = () => {
    setLoader(true);
    productService
      .deactivateProductMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Product record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateProjectMaster = () => {
    setLoader(true);
    projectService
      .deactivateProjectMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Project record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateTaxMaster = () => {
    setLoader(true);
    taxService
      .deactivateTaxMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Tax record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateCountryMaster = () => {
    setLoader(true);
    countryService
      .deactivateCountryMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `States record ${
            patchData?.isactive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateStatesMaster = () => {
    setLoader(true);
    stateService
      .deactivateStateMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `States record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateClientMaster = () => {
    setLoader(true);
    clientService
      .deactivateClientMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Client record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateClientBillToMaster = () => {
    setLoader(true);
    clientService
      .deactivateClientBillToMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Client Bill To record ${
            patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const deactivateClientShipToMaster = () => {
    setLoader(true);
    clientService
      .deactivateClientShipToMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Client Ship To record ${
            patchData?.isactive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const openClientFormButton = async () => {
    await formatIndustry_ClientDetails();
    await formatAccount_ClientDetails();
    setOpenClientForm(true);
  };

  const closeClientForm = () => {
    setOpenClientForm(false);
  };

  // const selectAttachment = (files: any) => {
  //   console.log("files", files);

  //   setAttachments([]);
  //   if (files && files[0]) {
  //     _.each(files, (eventList) => {
  //       if (
  //         eventList.name
  //           .split(".")
  //           [eventList.name.split(".").length - 1].toLowerCase() ===
  //         FILE_TYPES.PDF
  //       ) {
  //         if (eventList.size > 10485760) {
  //           return ToasterService.show(
  //             "file size is too large, allowed maximum size is 10 MB.",
  //             "error"
  //           );
  //         } else {
  //           const fileWithUrl = {
  //             ...eventList,
  //             preview: URL.createObjectURL(eventList),
  //           };
  //           setAttachments((prevVals: any) => [...prevVals, fileWithUrl]);
  //         }
  //       } else {
  //         ToasterService.show(
  //           `Invalid file format. You can only attach PNG files here!`,
  //           "error"
  //         );
  //         eventList = null;
  //       }
  //     });
  //   }
  // };
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
        // deactivateCompanyMaster();
        deactivateCountryMaster();
        break;
      case 1:
        deactivateCompanyLocationMaster();
        break;
      case 2:
        deactivateCurrencyMaster();
        break;
      case 3:
        deactivateAccountsMaster();
        break;
      case 4:
        deactivateIndustryMaster();
        break;
      case 5:
        deactivateTechnologyMaster();
        break;
      case 6:
        deactivateProductMaster();
        break;
      case 7:
        deactivateProjectMaster();
        break;
      case 8:
        deactivateTaxMaster();
        break;
      case 10:
        deactivateStatesMaster();
        break;
      case 11:
        deactivateClientMaster();
        break;
      case 12:
        deactivateClientBillToMaster();
        break;
      case 13:
        deactivateClientShipToMaster();
        break;
      default:
        break;
    }
  };

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
            className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
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
            // data-pr-tooltip={rowData.currencyName}
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
            // data-pr-tooltip={rowData.currencyDescription}
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

  const TechnologyMasterColumns = [
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
            className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isActive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Technology",
      fieldName: "technologyName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "technologyName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.productName}
          >
            {rowData.technologyName}
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
            // data-pr-tooltip={rowData.productDescription}
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
            className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
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
            // data-pr-tooltip={rowData.productName}
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
            // data-pr-tooltip={rowData.productDescription}
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
            className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
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
            // data-pr-tooltip={rowData.projectName}
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
            // data-pr-tooltip={rowData.projectDescription}
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
            className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
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
            // data-pr-tooltip={rowData.taxType}
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
            // data-pr-tooltip={rowData.taxPercentage}
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
            // data-pr-tooltip={rowData.effectiveDate}
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
            className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
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
            // data-pr-tooltip={rowData.industry_name}
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
            // data-pr-tooltip={rowData.name}
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
            // data-pr-tooltip={rowData.alias}
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
            // data-pr-tooltip={rowData.pan_no}
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
            // data-pr-tooltip={rowData.polestar_bank_account_number}
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
            // data-pr-tooltip={rowData.salutation}
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
            // data-pr-tooltip={rowData.first_name}
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
            // data-pr-tooltip={rowData.last_name}
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
            // data-pr-tooltip={rowData.email}
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
            // data-pr-tooltip={rowData.phone}
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
            // data-pr-tooltip={rowData.msa_flag}
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
            // data-pr-tooltip={rowData.gstn}
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
            // data-pr-tooltip={rowData.msa_start_date}
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
            // data-pr-tooltip={rowData.msa_end_date}
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
            // data-pr-tooltip={rowData.non_solicitation_clause}
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
            // data-pr-tooltip={rowData.use_logo_permission}
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
            // data-pr-tooltip={rowData.client_category}
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
            // data-pr-tooltip={rowData.servicing_type}
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
            // data-pr-tooltip={rowData.missing_msa_deadline}
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
            // data-pr-tooltip={rowData.is_msa_missing}
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

  const ClientBillToMasterColumns = [
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
            // data-pr-tooltip={rowData.pin}
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
            // data-pr-tooltip={rowData.country_name}
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

  const ClientShipToMasterColumns = [
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
            // data-pr-tooltip={rowData.client_ship_to_address1}
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
            // data-pr-tooltip={rowData.client_ship_to_address2}
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
            // data-pr-tooltip={rowData.client_ship_to_address3}
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
            // data-pr-tooltip={rowData.client_ship_to_pin}
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
      fieldName: "country_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "country_name",
      changeFilter: true,
      placeholder: "Shipping Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.country_name}
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
      label: "Shipping State",
      fieldName: "state_name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "state_name",
      changeFilter: true,
      placeholder: "Shipping State",
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
            // data-pr-tooltip={rowData.client_ship_to_gstn}
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

  const onDelete = (data: any) => {
    patchData = data;
    setActionPopupToggle({
      displayToggle: false,
      title: "Delete",
      message: `Are you sure you want to ${
        !(data?.isactive || data?.is_active || data?.isActive)
          ? "activate"
          : "deactivate"
      } this record?`,
      acceptFunction: confirmDelete,
      rejectFunction: onPopUpClose,
    });
    setShowConfirmDialogue(true);
  };

  const [stateData, setStateData] = useState<any>();

  const onUpdate = (data: any) => {
    setStateData(data);
    switch (activeIndex) {
      case 0:
        updateCountryMaster(data);
        // updateCompanyMaster(data);
        break;
      case 1:
        updateCompanyLocationMaster(data);
        break;
      case 2:
        updateCurrencyMaster(data);
        break;
      case 3:
        updateAccountsMaster(data);
        break;
      case 4:
        updateIndustryMaster(data);
        break;
      case 5:
        updateTechnologyMaster(data);
        break;
      case 6:
        updateProductMaster(data);
        break;
      case 7:
        updateProjectMaster(data);
        break;
      case 8:
        updateTaxMaster(data);
        break;
      case 10:
        updateStateMaster(data);
        break;
      case 11:
        updateClientMaster(data);
        setOpenClientForm(true);
        break;
      case 12:
        updateClientBillToMaster(data);
        break;
      case 13:
        updateClientShipToMaster(data);
        break;
      default:
        break;
    }
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const CountryFormFields = {
    name: {
      inputType: "inputtext",
      label: "Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    code: {
      inputType: "inputtext",
      label: "Code",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    language: {
      inputType: "inputtext",
      label: "Language",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    phoneCode: {
      inputType: "inputtext",
      label: "Phone Code",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
  };

  const updateCountryMaster = (data: any) => {
    try {
      CountryFormFields.name.value = data?.name;
      CountryFormFields.code.value = data?.code;
      CountryFormFields.language.value = data?.language;
      CountryFormFields.phoneCode.value = data?.phoneCode;
      setCountryForm(_.cloneDeep(CountryFormFields));
      const addressDetails = JSON.parse(data?.addressAdditionalFields);
      const addressForm = Object.keys(addressDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: `Option ${index + 1}`,
            value: addressDetails[`key${index + 1}`],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      setCountryAddressForm(addressForm);
      const bankDetails = JSON.parse(data?.bankAccAdditionalFields);
      const bankForm = Object.keys(bankDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: `Option ${index + 1}`,
            value: bankDetails[`key${index + 1}`],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      setCountryBankForm(bankForm);
    } catch (error) {
      console.log("error", error);
    }
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
      CompanyFormFields.Email.value = data?.Email;
      CompanyFormFields.description.value =
        data?.description != null ? data?.description : "";
      setCompanyForm(_.cloneDeep(CompanyFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const CompanyLocationFormFields = {
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
    state_name: {
      inputType: "singleSelect",
      label: "State",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    address1: {
      inputType: "inputtext",
      label: "Address 1",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    address2: {
      inputType: "inputtext",
      label: "Address 2",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    address3: {
      inputType: "inputtext",
      label: "Address 3",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    pin: {
      inputType: "inputtext",
      label: "PIN",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    PAN: {
      inputType: "inputtext",
      label: "PAN",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    GST: {
      inputType: "inputtext",
      label: "GST",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
  };

  const updateCompanyLocationMaster = async (data: any) => {
    try {
      companyLocationFieldsStructure.companyName.value = data?.company;
      companyLocationFieldsStructure.country_name.value = data?.country;
      companyLocationFieldsStructure.state_name.value = data?.state;
      companyLocationFieldsStructure.address1.value = data?.address1;
      companyLocationFieldsStructure.address2.value = data?.address2;
      companyLocationFieldsStructure.address3.value = data?.address3;
      companyLocationFieldsStructure.pin.value = data?.pin;
      companyLocationFieldsStructure.PAN.value = data?.PAN;
      companyLocationFieldsStructure.GST.value = data?.GST;
      setCompanyLocationForm(_.cloneDeep(companyLocationFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const [
    companyLocationFieldsStructure,
    setCompanyLocationFieldsStructure,
  ]: any = useState(CompanyLocationFormFields);

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
      label: "Bank Account Type",
      options: ["Savings", "Current"],
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

  const TechnologyFormFields = {
    technologyName: {
      inputType: "inputtext",
      label: "Technology Name",
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
        required: false,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
  };

  const updateTechnologyMaster = (data: any) => {
    try {
      TechnologyFormFields.technologyName.value = data?.technologyName;
      TechnologyFormFields.description.value = data?.description;
      setTechnologyForm(_.cloneDeep(TechnologyFormFields));
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

  const TaxFormFields: any = {
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

  const updateTaxMaster = async (data: any) => {
    try {
      TaxFormFields.taxType.value = data?.taxType;
      TaxFormFields.taxPercentage.value = data?.taxPercentage;
      TaxFormFields.effectiveDate.value = parseDateString(data?.effectiveDate);

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
      fieldWidth: "col-md-4",
    },
    state_name: {
      inputType: "inputtext",
      label: "State",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    state_code: {
      inputType: "inputtext",
      label: "State Code",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
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
      fieldWidth: "col-md-4",
    },
    name: {
      inputType: "inputtext",
      label: "Client Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    alias: {
      inputType: "inputtext",
      label: "Alias",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    pan_no: {
      inputType: "inputtext",
      label: "PAN Number",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    polestar_bank_account_number: {
      inputType: "singleSelect",
      label: "Polestar Bank Account Number",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    gstn: {
      inputType: "inputtext",
      label: "GSTN",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    servicing_type: {
      inputType: "singleSelect",
      label: "Servicing Type",
      options: ["Domestic", "International"],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    client_category: {
      inputType: "inputtext",
      label: "Client Category",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    msa_start_date: {
      inputType: "singleDatePicker",
      label: "MSA Start Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    msa_end_date: {
      inputType: "singleDatePicker",
      label: "MSA End Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4 col-offset-right-8",
    },
    is_msa_missing: {
      inputType: "inputSwitch",
      label: "MSA Missing?",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-3",
    },
    msa_flag: {
      inputType: "inputSwitch",
      label: "Is NDA",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-3",
    },
    non_solicitation_clause: {
      inputType: "inputSwitch",
      label: "Non Solicitation Clause",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-3",
    },
    use_logo_permission: {
      inputType: "inputSwitch",
      label: "Use Logo Permission",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-3",
    },
  };

  const updateClientMaster = async (data: any) => {
    try {
      clientFieldsStructure.industry_name.value = data?.industry_name;
      clientFieldsStructure.name.value = data?.name;
      clientFieldsStructure.alias.value = data?.alias;
      clientFieldsStructure.pan_no.value = data?.pan_no;
      clientFieldsStructure.servicing_type.value = data?.servicing_type;
      clientFieldsStructure.client_category.value = data?.client_category;
      clientFieldsStructure.msa_start_date.value = parseDateString(
        data?.msa_start_date
      );
      clientFieldsStructure.msa_end_date.value = parseDateString(
        data?.msa_end_date
      );
      clientFieldsStructure.is_msa_missing.value = data?.is_msa_missing
        ? true
        : false;
      clientFieldsStructure.msa_flag.value = data?.msa_flag ? true : false;
      clientFieldsStructure.non_solicitation_clause.value =
        data?.non_solicitation_clause ? true : false;
      clientFieldsStructure.use_logo_permission.value =
        data?.use_logo_permission ? true : false;
      clientFieldsStructure.polestar_bank_account_number.value =
        data?.polestar_bank_account_number;
      clientFieldsStructure.gstn.value = data?.gstn;

      ClientContactFormFields.salutation.value = data?.salutation;
      ClientContactFormFields.first_name.value = data?.first_name;
      ClientContactFormFields.last_name.value = data?.last_name;
      ClientContactFormFields.email.value = data?.email;
      ClientContactFormFields.phone.value = data?.phone;

      setClientFieldsStructure(_.cloneDeep(clientFieldsStructure));
      setClientContactForm(_.cloneDeep(ClientContactFormFields));
    } catch (error) {
      console.log("error", error);
    }
  };

  const [clientFieldsStructure, setClientFieldsStructure]: any =
    useState(ClientFormFields);

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
  };

  const [clientBillFieldsStructure, setClientBillFieldsStructure]: any =
    useState(ClientBillFormFields);

  const ClientShipFormFields = {
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

  const updateClientBillToMaster = async (data: any) => {
    try {
      clientBillFieldsStructure.client_name.value = data?.client_name;
      clientBillFieldsStructure.address1.value = data?.address1;
      clientBillFieldsStructure.address2.value = data?.address2;
      clientBillFieldsStructure.address3.value = data?.address3;
      clientBillFieldsStructure.pin.value = data?.pin;
      clientBillFieldsStructure.country_name.value = data?.country_name;
      clientBillFieldsStructure.state_name.value = data?.state_name;

      setClientBillFieldsStructure(_.cloneDeep(clientBillFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateClientShipToMaster = async (data: any) => {
    try {
      clientShipFieldsStructure.client_name.value = data?.client_name;
      clientShipFieldsStructure.client_ship_to_address1.value =
        data?.client_ship_to_address1;
      clientShipFieldsStructure.client_ship_to_address2.value =
        data?.client_ship_to_address2;
      clientShipFieldsStructure.client_ship_to_address3.value =
        data?.client_ship_to_address3;
      clientShipFieldsStructure.client_ship_to_pin.value =
        data?.client_ship_to_pin;
      clientShipFieldsStructure.client_ship_to_country_name.value =
        data?.country_name;
      clientShipFieldsStructure.client_ship_to_state_name.value =
        data?.state_name;
      clientShipFieldsStructure.client_ship_to_gstn.value =
        data?.client_ship_to_gstn;

      setClientShipFieldsStructure(_.cloneDeep(clientShipFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
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

  const [CountryForm, setCountryForm] = useState<any>(
    _.cloneDeep(CountryFormFields)
  );

  const [CountryAddressForm, setCountryAddressForm] = useState<any>({});

  const [CountryBankForm, setCountryBankForm] = useState<any>({});

  const [CompanyForm, setCompanyForm] = useState<any>(
    _.cloneDeep(CompanyFormFields)
  );

  const [CompanyLocationForm, setCompanyLocationForm] = useState<any>(
    _.cloneDeep(companyLocationFieldsStructure)
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

  const [TechnologyForm, setTechnologyForm] = useState<any>(
    _.cloneDeep(TechnologyFormFields)
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
    setStateData({});
    setOpenClientForm(false);
    setCountryForm(_.cloneDeep(CountryFormFields));
    setCountryAddressForm({});
    setCountryBankForm({});
    setCompanyForm(_.cloneDeep(CompanyFormFields));
    setCompanyLocationFieldsStructure(_.cloneDeep(CompanyLocationFormFields));
    setCompanyLocationForm(_.cloneDeep(CompanyLocationFormFields));
    setCurrencyForm(_.cloneDeep(CurrencyFormFields));
    setAccountFieldsStructure(_.cloneDeep(AccountsFormFields));
    setAccountForm(_.cloneDeep(AccountsFormFields));
    setIndustryForm(_.cloneDeep(IndustryFormFields));
    setTechnologyForm(_.cloneDeep(TechnologyFormFields));
    setProductForm(_.cloneDeep(ProductFormFields));
    setProjectForm(_.cloneDeep(ProjectFormFields));
    setTaxForm(_.cloneDeep(TaxFormFields));
    setStatesFieldsStructure(_.cloneDeep(StatesFormFields));
    setStatesForm(_.cloneDeep(StatesFormFields));
    setClientFieldsStructure(_.cloneDeep(ClientFormFields));
    setClientForm(_.cloneDeep(ClientFormFields));
    setClientBillFieldsStructure(_.cloneDeep(ClientBillFormFields));
    setClientBillForm(_.cloneDeep(ClientBillFormFields));
    setClientShipFieldsStructure(_.cloneDeep(ClientShipFormFields));
    setClientShipForm(_.cloneDeep(ClientShipFormFields));
    setClientContactForm(_.cloneDeep(ClientContactFormFields));
    // setCountryForm(_.cloneDeep(CountryFormFields))
    setAttachments([]);
  };

  const companyLocationFormHandler = async (form: FormType) => {
    setCompanyLocationForm(form);
  };

  const currencyFormHandler = async (form: FormType) => {
    setCurrencyForm(form);
  };

  const accountsFormHandler = async (form: FormType) => {
    setAccountForm(form);
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

  const createNewTax = async (event: FormEvent) => {
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
        effectiveDate: formatDate(TaxForm?.effectiveDate?.value),
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

  const createClientForm = async (event: FormEvent) => {
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

      const polestar_bank_account_id =
        accountsMaster.find(
          (account: any) =>
            account.account_no === ClientForm.polestar_bank_account_number.value
        )?.account_id ?? null;

      const formData: any = new FormData();

      const obj = {
        industry_id: industry_id,
        name: ClientForm?.name?.value,
        alias: ClientForm?.alias?.value,
        pan_no: ClientForm?.pan_no?.value,
        polestar_bank_account_id: polestar_bank_account_id,
        gstn: ClientForm?.gstn?.value,
        salutation: ClientContactForm?.salutation?.value,
        first_name: ClientContactForm?.first_name?.value,
        last_name: ClientContactForm?.last_name?.value,
        email: ClientContactForm?.email?.value,
        phone: ClientContactForm?.phone?.value,
        msa_flag: ClientForm?.msa_flag?.value ? 1 : 0,
        is_performa: ClientForm?.is_performa?.value ? 1 : 0,
        msa_start_date: formatDate(ClientForm?.msa_start_date?.value),
        msa_end_date: formatDate(ClientForm?.msa_end_date?.value),
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

        if (attachments?.length) {
          formData.set("file", attachments[0]);
        }

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

  const createClientBillInfo = async (event: FormEvent) => {
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
      const clientId =
        clientMaster.find(
          (client: any) => client.name === ClientBillForm.client_name.value
        )?.id ?? null;

      const countryId =
        countryMaster.find(
          (country: any) => country.name === ClientBillForm.country_name.value
        )?.id ?? null;

      const stateId =
        stateMaster.find(
          (state: any) => state.state_name === ClientBillForm.state_name.value
        )?.state_id ?? null;

      const obj = {
        clientId: clientId,
        address1: ClientBillForm?.address1?.value,
        address2: ClientBillForm?.address2?.value,
        address3: ClientBillForm?.address3?.value,
        pin: ClientBillForm?.pin?.value,
        countryId: countryId,
        stateId: stateId,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        clientService
          .createClientBillToMaster(obj)
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
        const updatePayload = { ...obj, billingId: stateData?.id };

        clientService
          .updateClientBillToMaster(updatePayload)
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

  const createClientShipInfo = async (event: FormEvent) => {
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
      const clientId =
        clientMaster.find(
          (client: any) => client.name === ClientShipForm.client_name.value
        )?.id ?? null;

      const countryId =
        countryMaster.find(
          (country: any) =>
            country.name === ClientShipForm.client_ship_to_country_name.value
        )?.id ?? null;

      const stateId =
        stateMaster.find(
          (state: any) =>
            state.state_name === ClientShipForm.client_ship_to_state_name.value
        )?.state_id ?? null;

      const obj = {
        clientId: clientId,
        address1: ClientShipForm?.client_ship_to_address1?.value,
        address2: ClientShipForm?.client_ship_to_address2?.value,
        address3: ClientShipForm?.client_ship_to_address3?.value,
        pin: ClientShipForm?.client_ship_to_pin?.value,
        gstn: ClientShipForm?.client_ship_to_gstn?.value,
        countryId: countryId,
        stateId: stateId,
        updatedBy: loggedInUserId,
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
        const updatePayload = { ...obj, shippingId: stateData?.id };

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

  const moveNextClientForm = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(ClientForm, (item: any) => {
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
      <TabView
        activeIndex={activeIndex}
        onTabChange={onTabChange}
        className={classes["main-tab-screen"]}
        panelContainerClassName={classes["panel-tabs"]}
      >
        <TabPanel header="Country">
          <CountryMaster />
        </TabPanel>
        <TabPanel header="States">
          <StateMaster />
        </TabPanel>
        <TabPanel header="Regions">
          <RegionMaster />
        </TabPanel>
        <TabPanel header="Company">
          <CompanyMaster />
        </TabPanel>
        <TabPanel header="Company Location">
          <CompanyAddressMaster />
        </TabPanel>
        <TabPanel header="Bank Account Type">
          <AccountTypeMaster />
        </TabPanel>
        <TabPanel header="Bank Accounts">
          <AccountMaster />
        </TabPanel>
        {/* <TabPanel header="Production Type">
          <ProductionTypeMaster />
        </TabPanel> */}
        <TabPanel header="Sub-Industry">
          <IndustryMaster />
        </TabPanel>
        <TabPanel header="Industry Group">
          <IndustryGroupMaster />
        </TabPanel>
        <TabPanel header="Industry Head">
          <IndustryHeadMaster />
        </TabPanel>
        <TabPanel header="Sales Manager">
          <SalesMaster />
        </TabPanel>
        <TabPanel header="Account Manager">
          <AccountManagerMaster />
        </TabPanel>
        <TabPanel header="Technology Group">
          <TechGroupMaster />
        </TabPanel>
        <TabPanel header="Technology Sub-Group">
          <TechSubGroupMaster />
        </TabPanel>
        <TabPanel header="Technology">
          <TechMaster />
        </TabPanel>
        <TabPanel header="OEM">
          <OemMaster/>
        </TabPanel>
        <TabPanel header="Polestar Product Sales">
          <PolestarProductSalesMaster />
        </TabPanel>
        <TabPanel header="Project/Service Master ">
          <ProjectServiceMaster />
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
                                          onRemove={() => removeFileHandler()}
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
                      submitEvent={closeFormPopup}
                    />
                    <ButtonComponent
                      label="Submit Form"
                      icon="pi pi-check"
                      iconPos="right"
                      submitEvent={createClientForm}
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
            </>
          )}
        </TabPanel>
        <TabPanel header="Client Bill To">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add Client Bill Info"
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
                    <h4 className="popup-heading">Add Client Bill Info</h4>
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
                </div>

                <div className="popup-lower-btn">
                  <ButtonComponent
                    label="Submit"
                    icon="pi pi-check"
                    iconPos="right"
                    submitEvent={createClientBillInfo}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </TabPanel>
        <TabPanel header="Client Ship To">
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "0.5em",
            }}
          >
            <ButtonComponent
              label="Add Client Ship Info"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={openSaveForm}
            />
          </div>
          <p className="m-0">
            <DataTableBasicDemo
              data={clientShipToMaster}
              column={ClientShipToMasterColumns}
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
                    <h4 className="popup-heading">Add Client Shipping Info</h4>
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
                    form={_.cloneDeep(ClientShipForm)}
                    formUpdateEvent={clientShipFormHandler}
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
        </TabPanel>
      </TabView>
    </>
  );
};

export default Master;
