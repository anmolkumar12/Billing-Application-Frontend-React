import React, { FormEvent, useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ui/button/Button";
import DataTableBasicDemo from "../../components/ui/table/Table";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";
import FormComponent from "../../components/ui/form/form";
import classes from "./Master.module.scss";
import Cookies from "universal-cookie";
import { Tooltip } from "primereact/tooltip";
import _ from "lodash";
import { ToasterService } from "../../services/toaster-service/toaster-service";
import { CONSTANTS } from "../../constants/Constants";
import { FormType } from "../../schemas/FormField";
import { HTTP_RESPONSE } from "../../enums/http-responses.enum";
import { Loader } from "../../components/ui/loader/Loader";
import { IndustryMasterService } from "../../services/masters/industry-master/industry.service";
import { CountryMasterService } from "../../services/masters/country-master/country.service";
import { StateMasterService } from "../../services/masters/state-master/state.service";
import { RegionMasterService } from "../../services/masters/region-master/region.service";
import moment from "moment";
import { CompanyMasterService } from "../../services/masters/company-master/company.service";
import { ValidationRegex } from "../../constants/ValidationRegex";

const IndustryHeadMaster = () => {
  const IndustryHeadFormFields: any = {
    industryHeadName: {
      inputType: "inputtext",
      label: "Industry Head Name",
      value: null,
      validation: {
        required: true,
        pattern:ValidationRegex.onlyCharacters.pattern,
        patternHint:ValidationRegex.onlyCharacters.patternHint
      },
      fieldWidth: "col-md-4",
    },
    code: {
      inputType: "inputtext",
      label: "Industry Head Ecode",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    industry_head_email: {
      inputType: "inputtext",
      label: "Industry Head Email",
      value: null,
      validation: {
        required: true,
        email:true
      },
      fieldWidth: "col-md-6",
    },
    industryNames: {
      inputType: "multiSelect",
      label: "Industry Group",
      value: null,
      options: [],
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    isRegionWise: {
      inputType: "inputSwitch",
      label: "Region Wise",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    companyName: {
      inputType: "singleSelect",
      label: "Company",
      disable:false,
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
    region_code: {
      inputType: "multiSelect",
      label: "Region",
      options: [],
      value: null,
      disable: true,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    state_name: {
      inputType: "multiSelect",
      label: "State",
      options: [],
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    start_date: {
      inputType: "singleDatePicker",
      label: "Start Date",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    end_date: {
      inputType: "singleDatePicker",
      label: "End Date",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
  };
  const [industryMaster, setIndustryMaster] = useState<any>([]);
  const [industryHeadMaster, setIndustryHeadMaster] = useState<any>([]);
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [regionMaster, setRegionMaster] = useState<any>([]);
  const [stateMaster, setStateMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditIndustryHead, setIsEditIndustryHead] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [industryHeadFieldsStructure, setIndustryHeadFieldsStructure] =
    useState<any>(_.cloneDeep(IndustryHeadFormFields));
  const [IndustryHeadForm, setIndustryHeadForm] = useState<any>(
    _.cloneDeep(industryHeadFieldsStructure)
  );
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const companyService = new CompanyMasterService();


  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const industryService = new IndustryMasterService();
  const countryService = new CountryMasterService();
  const regionService = new RegionMasterService();
  const stateService = new StateMasterService();

  const IndustryHeadMasterColumns = [
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
      label: "Name",
      fieldName: "industryHeadName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryHeadName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.industryHeadName}
          >
            {rowData.industryHeadName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
          label: "Ecode",
          fieldName: "code",
          textAlign: "left",
          sort: true,
          filter: true,
          fieldValue: "code",
          changeFilter: true,
          placeholder: "Ecode",
          body: (rowData: any) => (
            <div>
              <span
                id={`companyNameTooltip-${rowData.id}`}
              // data-pr-tooltip={rowData.code}
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
          label: "Email",
          fieldName: "industry_head_email",
          textAlign: "left",
          sort: true,
          filter: true,
          fieldValue: "industry_head_email",
          changeFilter: true,
          placeholder: "Email",
          body: (rowData: any) => (
            <div>
              <span
                id={`companyNameTooltip-${rowData.id}`}
              // data-pr-tooltip={rowData.code}
              >
                {rowData.industry_head_email}
              </span>
              <Tooltip
                target={`#companyNameTooltip-${rowData.id}`}
                position="top"
              />
            </div>
          ),
        },
    {
      label: "Industry Group",
      fieldName: "industryNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryNames",
      changeFilter: true,
      placeholder: "Industry Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.industryNames}
          >
            {rowData.industryNames}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Company",
      fieldName: "companyName",
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
      label: "Region Wise",
      fieldName: "isRegionWise",
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
            {rowData.isRegionWise == 1 ? "Yes" : "No"}
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
      fieldName: "countryNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "countryNames",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.countryNames}
          >
            {rowData.countryNames}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Region",
      fieldName: "regionNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "regionNames",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.region_name}
          >
            {rowData.regionNames != null && rowData.regionNames != ""
              ? rowData.regionNames
              : "NA"}
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
      fieldName: "stateNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "stateNames",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.stateNames}
          >
            {rowData.stateNames != null && rowData.stateNames != ""
              ? rowData.stateNames
              : "NA"}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Start Date",
      fieldName: "startDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "startDate",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.startDate}
          >
            {rowData.viewStartDate}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "End Date",
      fieldName: "endDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "endDate",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.endDate}
          >
            {rowData.viewEndDate}
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
    {
      label: "Updated By",
      fieldName: "updated_by",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "updated_by",
      changeFilter: true,
      placeholder: "Updated By",
      body: (rowData: any) => (
        <div>
          <span id={`descriptionTooltip-${rowData.id}`}>
            {rowData?.updated_by}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
    {
      label: "Updated At",
      fieldName: "updated_at",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "updated_at",
      changeFilter: true,
      placeholder: "Description",
      body: (rowData: any) => (
        <div>
          <span id={`descriptionTooltip-${rowData.id}`}>
            {rowData.updated_at}
             {/* {moment(rowData.updated_at).format('YYYY-MM-DD HH:mm:ss')} */}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getIndustryHeadMaster();
      const industries = await getIndustryMaster();
      const countries = await getCountryMaster();
      const companies = await getCompanyMaster();
      await formatCompanyDetails(companies);
      await formatIndustryDetails(industries);
      await formatCountryDetails(countries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

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

  const getIndustryHeadMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryHeadMaster();
      response.industryHeads?.forEach((el: any) => {
        el.viewStartDate = moment(el?.startDate).format("YYYY-MM-DD")
        el.viewEndDate = el?.endDate ? moment(el?.endDate).format("YYYY-MM-DD") : null
        el.startDate = moment(el?.startDate).format("YYYY-MM-DD")
        el.endDate = el?.endDate ? moment(el?.endDate).format("YYYY-MM-DD") : null
        el.updated_at = el?.updated_at ? moment(el?.updated_at).format("YYYY-MM-DD") : null
      })
      
      // const formattedDataForExcel = response?.industryHeads.map(({ startDate, endDate, ...rest }: any) => rest);
      // console.log('formattedDataForExcel', formattedDataForExcel);
      setIndustryHeadMaster(response.industryHeads);
      return response?.industryHeads;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getIndustryMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryGroupMaster();
      const temp = response?.groupIndustries?.filter((item: any) => item?.isactive || item?.isActive)
      setIndustryMaster(temp);
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
      const temp = response?.countries?.filter((item: any) => item?.isactive || item?.isActive)
      setCountryMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getRegionMaster = async (countryId: any) => {
    // setLoader(true);
    try {
      const response = await regionService.getRegionMaster(countryId);
      const temp = response?.regions?.filter((item: any) => item?.isactive || item?.isActive)
      setRegionMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      //   setLoader(false);
    }
  };

  const getStateMaster = async (countryId: any) => {
    // setLoader(true);
    try {
      const response = await stateService.getStateMaster(countryId);
      const temp = response?.states?.filter((item: any) => item?.isactive || item?.isActive)
      setStateMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      //   setLoader(false);
    }
  };

  const formatCompanyDetails = async (companies: any = companyMaster) => {
    const companyList = companies.map((company: any) => company?.companyName);    
    industryHeadFieldsStructure.companyName.options = companyList;
    setIndustryHeadFieldsStructure(industryHeadFieldsStructure);
  };

  const formatIndustryDetails = async (industries: any = industryMaster) => {
    const industryList = industries.map(
      (industry: any) => industry?.groupIndustryName
    );
    industryHeadFieldsStructure.industryNames.options = industryList;
    setIndustryHeadFieldsStructure(industryHeadFieldsStructure);
    await industryHeadFormHandler(industryHeadFieldsStructure);
  };

  const formatCountryDetails = async (countries: any = countryMaster) => {
    const countrylist = countries.map((country: any) => country?.name);
    industryHeadFieldsStructure.country_name.options = countrylist;
    setIndustryHeadFieldsStructure(industryHeadFieldsStructure);
    await industryHeadFormHandler(industryHeadFieldsStructure); 
  };

  const formatRegionDetails = async (regions: any = regionMaster) => {
    const regionlist = regions.map((region: any) => region.regionCode);
    industryHeadFieldsStructure.region_code.options = regionlist;
    setIndustryHeadFieldsStructure(industryHeadFieldsStructure);
  };

  const formatStateDetails = async (states: any = stateMaster) => {
    const statelist = states.map((state: any) => state.stateName);
    industryHeadFieldsStructure.state_name.options = statelist;
    setIndustryHeadFieldsStructure(industryHeadFieldsStructure);
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
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

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const modifyFormRegionWise = async (selectedCountries: any) => {
    let regionsList: any[] = [];
    const regionPromises = selectedCountries?.map(async (item: any) => {
      const country = countryMaster?.find(
        (country: any) => country?.name === item
      );
      if (country) {
        const regions = await getRegionMaster(country?.id);
        return regions;
      }
      return [];
    });
    const allRegions = await Promise?.all(regionPromises);
    regionsList = allRegions?.flat();
    setRegionMaster(regionsList);
    await formatRegionDetails(regionsList);
    const regionCodes = regionsList?.map((item: any) => item?.regionCode);
    return [regionCodes, regionsList];
  };

  const modifyFormStateWise = async (selectedCountries: any) => {
    let statesList: any[] = [];
    const statePromises = selectedCountries?.map(async (item: any) => {
      const country = countryMaster?.find(
        (country: any) => country?.name === item
      );
      if (country) {
        const states = await getStateMaster(country?.id);
        return states;
      }
      return [];
    });
    const allStates = await Promise?.all(statePromises);
    statesList = allStates?.flat();
    setStateMaster(statesList);
    await formatStateDetails(statesList);
    const stateNames = statesList?.map((item: any) => item?.stateName);
    return stateNames;
  };

  const industryHeadFormHandler = async (form: FormType) => {
    console.log('form------->',form);
    // if (form?.isRegionWise?.value != IndustryHeadForm?.isRegionWise?.value) {
    //   form.country_name.value = null;
    // }

    const selectedCompany = companyMaster?.find(
      (item: any) => item?.companyName == form?.companyName?.value
    );
    const selectedCountry = countryMaster?.find(
      (item: any) => item?.name == selectedCompany?.countryName
    );
    
    if (selectedCountry) {
      form.country_name.value = selectedCompany?.countryName;
      const regionList = await getRegionMaster(selectedCountry?.id);
      const stateList = await getStateMaster(selectedCountry?.id);
        if (stateList) {
          const stateNames = stateList?.map((state: any) => state.stateName);
          form.state_name.options = stateNames || [];
          // form.state_name.value = null;
        }
        if (regionList) {
          const regionNames = regionList?.map((state: any) => state.regionCode);
          form.region_code.options = regionNames || [];
        // form.state_name.value = null;
      }
    console.log('form------->',form);

    }


    // if (form?.isRegionWise?.value == true) {
    //   form.region_code.disable = false;
    //   if (form.region_code.validation) {
    //     form.region_code.validation.required = true;
    //   }
    //   form.state_name.value = null;
    //   form.state_name.disable = true;
    //   if (form.state_name.validation) {
    //     form.state_name.validation.required = false;
    //   }
    //   console.log('IndustryHeadForm?.country_name?.value----------->',IndustryHeadForm?.country_name?.value)
    //   // const countryAreUnequal =
    //   //   JSON.stringify(form?.country_name?.value) !==
    //   //   JSON.stringify(IndustryHeadForm?.country_name?.value);
    //   //   console.log('form.country_name.value--------->',form.country_name.value)
    //   // if (countryAreUnequal && form.country_name.value != null) {
    //   //   const [regionCodesList, regionList]: any = await modifyFormRegionWise(
    //   //     form?.country_name?.value
    //   //   );
    //   //   console.log('regionCodesList-->',regionCodesList)
    //   //   form.region_code.options = regionCodesList;
    //   //   form.region_code.value = null;
    //   // }
    // } else {
    //   form.state_name.disable = false;
    //   if (form.state_name.validation) {
    //     form.state_name.validation.required = true;
    //   }
    //   form.region_code.value = null;
    //   form.region_code.disable = true;
    //   if (form.region_code.validation) {
    //     form.region_code.validation.required = false;
    //   }
    //   // const countryAreUnequal =
    //   //   JSON.stringify(form?.country_name?.value) !==
    //   //   JSON.stringify(IndustryHeadForm?.country_name?.value);
    //   // if (countryAreUnequal && form.country_name.value != null) {
    //   //   const stateNamesList: any = await modifyFormStateWise(
    //   //     form?.country_name?.value
    //   //   );
    //   //   form.state_name.options = stateNamesList;
    //   //   form.state_name.value = null;
    //   // }
    // }
    setIndustryHeadForm(form);
  };

  const onUpdate = async (data: any) => {
    setStateData(data);
    let regionCodeList = [];
    let regionList: any = [];
    let regionNamesList = [];
    let stateList = [];
    const countries = data?.countryNames?.split(",");
    if (data?.isRegionWise == 1) {
      [regionCodeList, regionList] = await modifyFormRegionWise(countries);
      const regionNamesArray = data?.regionNames?.split(",") || [];
      regionNamesList = regionNamesArray.map((regionName: any) => {
        const region = regionList?.find(
          (regionItem: any) => regionItem.regionName === regionName
        );
        return region ? region.regionCode : null;
      });
    } else {
      stateList = await modifyFormStateWise(countries);
    }
    updateIndustryHeadMaster(data, regionCodeList, regionNamesList, stateList);
    setFormPopup(true);
    setIsEditIndustryHead(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateIndustryHeadMaster = (
    data: any,
    regionCodeList: any,
    regionNamesList: any,
    stateList: any
  ) => {
    console.log('llllllllllllllll', data);
    
    try {
      industryHeadFieldsStructure.companyName.value = data?.companyName;
      industryHeadFieldsStructure.industryHeadName.value =
        data?.industryHeadName;
        industryHeadFieldsStructure.code.value = data?.code;
      industryHeadFieldsStructure.industry_head_email.value = data?.industry_head_email;
      industryHeadFieldsStructure.industryNames.value =
        data?.industryNames?.split(",");
      industryHeadFieldsStructure.country_name.value =
        data?.countryNames?.split(",");
      industryHeadFieldsStructure.isRegionWise.value =
        data?.isRegionWise == 1 ? true : false;
      if (data?.isRegionWise == 1) {
        industryHeadFieldsStructure.region_code.value = regionNamesList;
        industryHeadFieldsStructure.region_code.options = regionCodeList;
        industryHeadFieldsStructure.state_name.options = [];
        industryHeadFieldsStructure.state_name.value = null;
      } else {
        industryHeadFieldsStructure.region_code.value = null;
        industryHeadFieldsStructure.region_code.options = [];
        industryHeadFieldsStructure.state_name.options = stateList;
        industryHeadFieldsStructure.state_name.value =
          data?.stateNames?.split(",") || null;
      }
      industryHeadFieldsStructure.start_date.value = parseDateString(
        data?.startDate
      );
      industryHeadFieldsStructure.end_date.value = parseDateString(
        data?.endDate
      );
      setIndustryHeadForm(_.cloneDeep(industryHeadFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewIndustryHead = (event: FormEvent) => {
    console.log('IndustryHeadForm', IndustryHeadForm);
    
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(IndustryHeadForm, (item: any) => {
      if (item?.validation?.required) {
        // companyFormValid.push(item.valid);
        companyValidityFlag =
          companyValidityFlag &&
          item.value;
      }
      // if (
      //   (IndustryHeadForm?.isRegionWise?.value == false &&
      //     IndustryHeadForm?.state_name?.value == null) ||
      //   (IndustryHeadForm?.isRegionWise?.value == true &&
      //     IndustryHeadForm?.region_code?.value == null)
      // ) {
      //   companyValidityFlag = false;
      // }
    });
    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      let industryIds = "";
      IndustryHeadForm?.industryNames?.value?.forEach((item: any) => {
        const id =
          industryMaster?.find(
            (industry: any) => industry?.groupIndustryName == item
          )?.id ?? null;
        if (id != null) {
          industryIds = industryIds != "" ? industryIds + "," + id : id;
        }
      });
      // let countryIds = "";
      // IndustryHeadForm?.country_name?.value?.forEach((item: any) => {
      //   const id =
      //     countryMaster?.find((country: any) => country?.name == item)?.id ??
      //     null;
      //   if (id != null) {
      //     countryIds = countryIds != "" ? countryIds + "," + id : id;
      //   }
      // });
      let regionIds = "";
      IndustryHeadForm?.region_code?.value?.forEach((item: any) => {
        const id =
          regionMaster?.find((region: any) => region?.regionCode == item)?.id ??
          null;
        if (id != null) {
          regionIds = regionIds != "" ? regionIds + "," + id : id;
        }
      });
      let stateIds = "";
      IndustryHeadForm?.state_name?.value?.forEach((item: any) => {
        const id =
          stateMaster?.find((state: any) => state?.stateName == item)?.id ??
          null;
        if (id != null) {
          stateIds = stateIds != "" ? stateIds + "," + id : id;
        }
      });

      const companyIds =
      companyMaster.find(
        (company: any) =>
          company.companyName === IndustryHeadForm.companyName.value
      )?.id ?? null;
      console.log('IndustryHeadForm',companyIds, companyMaster);

    const countryIds =
      countryMaster.find(
        (country: any) =>
          country.name === IndustryHeadForm.country_name.value
      )?.id ?? null;

    // const stateIds =
      // stateMaster.find(
      //   (state: any) =>
      //     state.stateName === IndustryHeadForm.state_name.value?.includes(state?.stateName)
      // )?.id ?? null;

      // stateMaster
      // .filter((state: any) => IndustryHeadForm?.state_name?.value?.includes(state?.regionCode))
      // .map((state: any) => state?.id);

      // const regionIds = regionMaster
      // .filter((region: any) => IndustryHeadForm?.region_ode?.value?.includes(region?.regionCode))
      // .map((region: any) => region?.id);

      const obj = {
        companyId: companyIds,
        industryHeadName: IndustryHeadForm?.industryHeadName?.value,
        industryIds: industryIds,
        code: IndustryHeadForm?.code?.value,
        industry_head_email: IndustryHeadForm?.industry_head_email.value,
        isRegionWise: IndustryHeadForm?.isRegionWise?.value == true ? 1 : 0,
        countryIds: countryIds,
        regionIds: regionIds != "" ? regionIds : null,
        stateIds: stateIds != "" ? stateIds : null,
        startDate: formatDate(IndustryHeadForm?.start_date?.value) || null,
        endDate: IndustryHeadForm?.end_date?.value ? formatDate(IndustryHeadForm?.end_date?.value) : null,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        industryService
          .createIndustryHeadMaster(obj)
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
        const updatePayload = { ...obj, industryHeadId: stateData?.id };
        industryService
          .updateIndustryHeadMaster(updatePayload)
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
      message: `Are you sure you want to ${
        !(data?.isactive || data?.is_active || data?.isActive)
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
    
    industryService
      .deactivateIndustryHeadMaster({ ...patchData, loggedInUserId, deactivationDate: deactivationDate ? formatDate(deactivationDate) : null, })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Industry Head record ${
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

  const closeFormPopup = () => {
    setFormPopup(false);
    setIsEditIndustryHead(false);
    setStateData({});
    setIndustryHeadFieldsStructure(_.cloneDeep(IndustryHeadFormFields));
    setIndustryHeadForm(_.cloneDeep(IndustryHeadFormFields));
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
          label="Add New Industry Head"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={industryHeadMaster}
          column={IndustryHeadMasterColumns}
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
                <h4 className="popup-heading">{isEditIndustryHead ? 'Update' : 'Add New'} Industry Head</h4>
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
                form={_.cloneDeep(IndustryHeadForm)}
                formUpdateEvent={industryHeadFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewIndustryHead}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default IndustryHeadMaster;