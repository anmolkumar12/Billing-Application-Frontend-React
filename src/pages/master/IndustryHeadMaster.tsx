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

const IndustryHeadMaster = () => {
  const IndustryHeadFormFields: FormType = {
    industryHeadName: {
      inputType: "inputtext",
      label: "Industry Head Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    industryNames: {
      inputType: "multiSelect",
      label: "Industries",
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
    country_name: {
      inputType: "multiSelect",
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
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    start_date: {
      inputType: "singleDatePicker",
      label: "Start Date",
      value: null,
      validation: {
        required: false,
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
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [industryHeadFieldsStructure, setIndustryHeadFieldsStructure] =
    useState<any>(_.cloneDeep(IndustryHeadFormFields));
  const [IndustryHeadForm, setIndustryHeadForm] = useState<any>(
    _.cloneDeep(industryHeadFieldsStructure)
  );

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
      label: "Industry Head Name",
      fieldName: "industryHeadName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryHeadName",
      changeFilter: true,
      placeholder: "Industry Head Name",
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
      label: "Industry Names",
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
            {rowData.startDate}
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
            {rowData.endDate}
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

  useEffect(() => {
    const fetchData = async () => {
      await getIndustryHeadMaster();
      const industries = await getIndustryMaster();
      const countries = await getCountryMaster();
      await formatIndustryDetails(industries);
      await formatCountryDetails(countries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getIndustryHeadMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryHeadMaster();
      setIndustryHeadMaster(response?.industryHeads);
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
      const response = await industryService.getIndustryMaster();
      setIndustryMaster(response?.industryMasters);
      return response?.industryMasters;
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

  const getRegionMaster = async (countryId: any) => {
    // setLoader(true);
    try {
      const response = await regionService.getRegionMaster(countryId);
      return response?.regions;
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
      return response?.states;
    } catch (error) {
      console.error(error);
    } finally {
      //   setLoader(false);
    }
  };

  const formatIndustryDetails = async (industries: any = industryMaster) => {
    const industryList = industries.map(
      (industry: any) => industry?.industryName
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
    if (form?.isRegionWise?.value != IndustryHeadForm?.isRegionWise?.value) {
      form.country_name.value = null;
    }
    if (form?.isRegionWise?.value == true) {
      form.region_code.disable = false;
      if (form.region_code.validation) {
        form.region_code.validation.required = true;
      }
      form.state_name.value = null;
      form.state_name.disable = true;
      if (form.state_name.validation) {
        form.state_name.validation.required = false;
      }
      console.log('IndustryHeadForm?.country_name?.value----------->',IndustryHeadForm?.country_name?.value)
      const countryAreUnequal =
        JSON.stringify(form?.country_name?.value) !==
        JSON.stringify(IndustryHeadForm?.country_name?.value);
        console.log('form.country_name.value--------->',form.country_name.value)
      if (countryAreUnequal && form.country_name.value != null) {
        const [regionCodesList, regionList]: any = await modifyFormRegionWise(
          form?.country_name?.value
        );
        console.log('regionCodesList-->',regionCodesList)
        form.region_code.options = regionCodesList;
        form.region_code.value = null;
      }
    } else {
      form.state_name.disable = false;
      if (form.state_name.validation) {
        form.state_name.validation.required = true;
      }
      form.region_code.value = null;
      form.region_code.disable = true;
      if (form.region_code.validation) {
        form.region_code.validation.required = false;
      }
      const countryAreUnequal =
        JSON.stringify(form?.country_name?.value) !==
        JSON.stringify(IndustryHeadForm?.country_name?.value);
      if (countryAreUnequal && form.country_name.value != null) {
        const stateNamesList: any = await modifyFormStateWise(
          form?.country_name?.value
        );
        form.state_name.options = stateNamesList;
        form.state_name.value = null;
      }
    }
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
    try {
      industryHeadFieldsStructure.industryHeadName.value =
        data?.industryHeadName;
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
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(IndustryHeadForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag =
          companyValidityFlag &&
          item.valid &&
          IndustryHeadForm?.country_name?.value != null;
      }
      if (
        (IndustryHeadForm?.isRegionWise?.value == false &&
          IndustryHeadForm?.state_name?.value == null) ||
        (IndustryHeadForm?.isRegionWise?.value == true &&
          IndustryHeadForm?.region_code?.value == null)
      ) {
        companyValidityFlag = false;
      }
    });
    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      let industryIds = "";
      IndustryHeadForm?.industryNames?.value?.forEach((item: any) => {
        const id =
          industryMaster?.find(
            (industry: any) => industry?.industryName == item
          )?.id ?? null;
        if (id != null) {
          industryIds = industryIds != "" ? industryIds + "," + id : id;
        }
      });
      let countryIds = "";
      IndustryHeadForm?.country_name?.value?.forEach((item: any) => {
        const id =
          countryMaster?.find((country: any) => country?.name == item)?.id ??
          null;
        if (id != null) {
          countryIds = countryIds != "" ? countryIds + "," + id : id;
        }
      });
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

      const obj = {
        industryHeadName: IndustryHeadForm?.industryHeadName?.value,
        industryIds: industryIds,
        isRegionWise: IndustryHeadForm?.isRegionWise?.value == true ? 1 : 0,
        countryIds: countryIds,
        regionIds: regionIds != "" ? regionIds : null,
        stateIds: stateIds != "" ? stateIds : null,
        startDate: formatDate(IndustryHeadForm?.start_date?.value),
        endDate: formatDate(IndustryHeadForm?.end_date?.value),
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
    });
    setShowConfirmDialogue(true);
  };

  const confirmDelete = () => {
    setLoader(true);
    industryService
      .deactivateIndustryHeadMaster({ ...patchData, loggedInUserId })
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
                <h4 className="popup-heading">Add New Industry Head</h4>
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
