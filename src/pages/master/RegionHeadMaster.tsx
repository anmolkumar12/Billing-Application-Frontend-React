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
import { CompanyMasterService } from "../../services/masters/company-master/company.service";
import { CountryMasterService } from "../../services/masters/country-master/country.service";
import { StateMasterService } from "../../services/masters/state-master/state.service";
import { RegionMasterService } from "../../services/masters/region-master/region.service";
import RegionHeadMasterService from "../../services/masters/region-head-master/regionHeadMaster.service";
import moment from "moment";
import { ValidationRegex } from "../../constants/ValidationRegex";

const RegionHeadMaster = () => {
  const [stateData, setStateData] = useState<any>();
  const CompanyLocationFormFields = {
    companyName: {
      inputType: "singleSelect",
      label: "Company",
      disable: false,
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
      disable: true,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    regionCode: {
      inputType: "multiSelect",
      label: "Region",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    regionHeadName: {
      inputType: "inputtext",
      label: "Region Head Name",
      value: null,
      validation: {
        required: true,
        pattern:ValidationRegex.onlyCharacters.pattern,
        patternHint:ValidationRegex.onlyCharacters.patternHint
      },
      fieldWidth: "col-md-4",
    },
    regionHeadEcode: {
      inputType: "inputtext",
      label: "Region Head Ecode",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    regionHeadEmail: {
      inputType: "inputtext",
      label: "Region Head Email",
      value: null,
      validation: {
        required: true,
        email:true,
      },
      fieldWidth: "col-md-4",
    },
    fromDate: {
      inputType: "singleDatePicker",
      label: "From Date",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    }
  };
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [stateMaster, setStateMaster] = useState<any>([]);
  const [companyLocationMaster, setCompanyLocationMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditCompanyLocation, setIsEditCompanyLocation] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [regionMaster, setRegionMaster] = useState<any>([]);


  const [deactivatePopup, setDeactivatePopup] = useState(false);
  const [rowData,setRowData] = useState<any>(null);
  const [isDeactivateFormValid,setIsDeactivateFormValid] = useState(true);


  const deactivateFormObject:any = {
    deactivationDate: {
      inputType: "singleDatePicker",
      label: "Select Deactivation Date",
      value: null,
      min:new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate()),
      max:new Date(new Date().getFullYear(), new Date().getMonth() + 6, new Date().getDate()),
      validation: {
        required: true,
      },
      fieldWidth: "col-md-12",
    },
  }

  const [deactForm,setDeactivateForm] = useState<any>(_.cloneDeep(deactivateFormObject));


  const [companyLocationFieldStructure, setCompanyLocationFieldStructure] =
    useState<any>(_.cloneDeep(CompanyLocationFormFields));
  const [CompanyLocationForm, setCompanyLocationForm] = useState<any>(
    _.cloneDeep(companyLocationFieldStructure)
  );
  const [AdditionalDetailsForm, setAdditionalDetailsForm] = useState<any>({});

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const companyService = new CompanyMasterService();
  const countryService = new CountryMasterService();
  const stateService = new StateMasterService();
  const regionService = new RegionMasterService();
  const regionHeadMasterService = new RegionHeadMasterService();

  const onDeactivate = (rowData:any) => {
    console.log('here we are')
    setRowData(rowData);
    if(rowData.isActive == 1){
    setDeactivatePopup(true);
    }
    else{
      onDelete(rowData);
    }

  }


  const CompanyLocationMasterColumns = [
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
            onClick={() => onDeactivate(rowData)}
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
          // data-pr-tooltip={rowData.companyName}
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
      label: "Country",
      fieldName: "countryName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "countryName",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.countryName}
          >
            {rowData.countryName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Region Names",
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
          // data-pr-tooltip={rowData.stateName}
          >
            {rowData.regionNames}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Region Head Name",
      fieldName: "regionHeadName",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.address}
          >
            {rowData.regionHeadName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Region Head Ecode",
      fieldName: "regionHeadEcode",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.address}
          >
            {rowData.regionHeadEcode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Region Head Email",
      fieldName: "regionHeadEmail",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.address}
          >
            {rowData.regionHeadEmail}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "From Date",
      fieldName: "fromDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "fromDate",
      changeFilter: true,
      placeholder: "From Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.fromDate}
          >
            {/* {rowData.fromDate} */}
            {moment(rowData?.fromDate).format('YYYY-MM-DD')}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "To Date",
      fieldName: "deactivationDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "deactivationDate",
      changeFilter: true,
      placeholder: "To Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.fromDate}
          >
            {rowData.deactivationDate}
           
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
             {moment(rowData.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getRegionHeadMaster();
      const companies = await getCompanyMaster();
      const countries = await getCountryMaster();
      await formatCompanyDetails(companies);
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

  const getRegionHeadMaster = async () => {
    setLoader(true);
    try {
      const response = await regionHeadMasterService.getRegionHeadMaster();
      setCompanyLocationMaster(response?.regionHeads);
      return response?.regionHeads;
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

  // const getStateMaster = async (countryId: any) => {
  //   // setLoader(true);
  //   try {
  //     const response = await stateService.getStateMaster(countryId);
  //     setStateMaster(response?.states);
  //     await formatStateDetails(response?.states);
  //     return response?.states;
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     //   setLoader(false);
  //   }
  // };

  const getRegionMaster = async (countryId: any) => {
    // setLoader(true);
    try {
      const response = await regionService.getRegionMaster(countryId);
      const temp = response?.regions?.filter((item: any) => item?.isactive || item?.isActive)
      setRegionMaster(temp);
      await formatRegionDetails(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      //   setLoader(false);
    }
  };

  const formatCompanyDetails = async (companies: any = companyMaster) => {
    const companyList = companies.map((company: any) => company?.companyName);
    companyLocationFieldStructure.companyName.options = companyList;
    setCompanyLocationFieldStructure(companyLocationFieldStructure);
  };

  const formatCountryDetails = async (countries: any = countryMaster) => {
    const countrylist = countries.map((country: any) => country?.name);
    companyLocationFieldStructure.country_name.options = countrylist;
    setCompanyLocationFieldStructure(companyLocationFieldStructure);
    await companyLocationFormHandler(companyLocationFieldStructure);
  };

  const formatStateDetails = async (states: any = stateMaster) => {
    const statelist = states.map((state: any) => state.stateName);
    companyLocationFieldStructure.state_name.options = statelist;
    setCompanyLocationFieldStructure(companyLocationFieldStructure);
  };

  const formatRegionDetails = async (regions: any = regionMaster) => {
    const regionlist = regions.map((region: any) => region.regionCode);
    companyLocationFieldStructure.regionCode.options = regionlist;
    setCompanyLocationFieldStructure(companyLocationFieldStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const companyLocationFormHandler = async (currentForm: FormType) => {
    const form = _.cloneDeep(currentForm);
    if (form?.companyName?.value != CompanyLocationForm?.companyName?.value) {
      const selectedCompany = companyMaster?.find(
        (item: any) => item?.companyName == form?.companyName?.value
      );
      const selectedCountry = countryMaster?.find(
        (item: any) => item?.name == selectedCompany?.countryName
      );
    console.log('form------->',selectedCompany, selectedCountry);

      if (selectedCountry) {
        form.country_name.value = selectedCompany?.countryName;
        const stateList = await getRegionMaster(selectedCountry?.id);

        if (stateList) {
          const regionNames = stateList?.map((state: any) => state.regionCode);
          form.regionCode.options = regionNames || [];
          // form.state_name.value = null;
        }
        // const addressDetails = JSON.parse(
        //   selectedCountry?.addressAdditionalFields
        // );
        // const detailsForm = Object.keys(addressDetails)?.reduce(
        //   (acc: any, item: any, index: any) => {
        //     acc[index] = {
        //       inputType: "inputtext",
        //       label: addressDetails[item],
        //       value: null,
        //       validation: {
        //         required: true,
        //       },
        //       fieldWidth: "col-md-4",
        //     };
        //     return acc;
        //   },
        //   {}
        // );
        // setAdditionalDetailsForm(detailsForm);
      }
    }
    setCompanyLocationForm(form);
  };

  // const additionalDetailsFormHandler = async (form: FormType) => {
  //   setAdditionalDetailsForm(form);
  // };

  const onUpdate = async (data: any) => {
    setStateData(data);
    const selectedCountry = countryMaster?.find(
      (item: any) => item?.name == data?.countryName
    );
    const regionList = await getRegionMaster(selectedCountry?.id);
    const regionNames = regionList?.map((region: any) => region.regionCode);
    
    updateCompanyLocationMaster(data, regionNames);
    setFormPopup(true);
    setIsEditCompanyLocation(true);
  };

  
  const closeDeactivation = () => {
    setRowData(null)
    setDeactivatePopup(false);
    setIsDeactivateFormValid(true);
    setDeactivateForm(_.cloneDeep(deactivateFormObject));
  }

  const onPopUpClose = (e?: any) => {
    closeDeactivation()
    setShowConfirmDialogue(false);
  };

  const deactivationFormHandler = async(form:FormType) => {
    setDeactivateForm(form);
  }

  const submitDeactivateFormHandler = (event: FormEvent) => {
    event.preventDefault();
    let validity = true;
    const deactivateFolrmValidaity: boolean[] = [];
    console.log('jjjjjjjjjjjj', deactForm);

    _.each(deactForm, (item: any) => {
      if (item?.validation?.required) {
        deactivateFolrmValidaity.push(item.valid);
        validity = validity && item.valid;
      }
    });

    setIsDeactivateFormValid(validity);
    if(validity){
    onDelete(rowData)
    }
  }

  


  const formatDate = (dateString: any) => {
    if(!dateString)return null;
    const date: any = new Date(dateString);
    if (isNaN(date)) return "";
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

  const updateCompanyLocationMaster = async (data: any, regionNames: any[]) => {
    try {
      companyLocationFieldStructure.companyName.value = data?.companyName;
      companyLocationFieldStructure.companyName.disable = true;
      companyLocationFieldStructure.country_name.value = data?.countryName;
      companyLocationFieldStructure.regionCode.options = regionNames;
      companyLocationFieldStructure.regionCode.value = data?.regionCodes.split(',');
      companyLocationFieldStructure.regionHeadEcode.value = data?.regionHeadEcode;
      companyLocationFieldStructure.regionHeadEmail.value = data?.regionHeadEmail;
      companyLocationFieldStructure.regionHeadName.value = data?.regionHeadName;
      companyLocationFieldStructure.fromDate.value = parseDateString(data?.fromDate);

      setCompanyLocationForm(_.cloneDeep(companyLocationFieldStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewCompanyLocation = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    console.log('oooooooooooo->>>>>>>>>', CompanyLocationForm);
    
    _.each(CompanyLocationForm, (item: any, key:string) => {
      if (item?.validation?.required) {
        // companyValidityFlag = companyValidityFlag && item.value;
        if (key === 'regionCode' && (!item.value || item.value.length === 0)) {
          companyValidityFlag = false;
        } else {
          companyValidityFlag = companyValidityFlag && !!item.value;
        }
      }
    });

    setIsFormValid(companyValidityFlag);

    const companyId =
      companyMaster.find(
        (company: any) =>
          company.companyName === CompanyLocationForm.companyName.value
      )?.id ?? null;

    const countryId =
      countryMaster.find(
        (country: any) =>
          country.name === CompanyLocationForm.country_name.value
      )?.id ?? null;

    const regionId = regionMaster
      .filter((region: any) => CompanyLocationForm?.regionCode?.value?.includes(region?.regionCode))
      .map((region: any) => region?.id);

    if (companyValidityFlag) {
      const obj = {
        companyId: companyId,
        countryId: countryId,
        regionId: regionId.toString(),
        regionHeadName: CompanyLocationForm?.regionHeadName?.value,
        regionHeadEcode: CompanyLocationForm?.regionHeadEcode?.value,
        regionHeadEmail: CompanyLocationForm?.regionHeadEmail?.value,
        fromDate: formatDate(CompanyLocationForm?.fromDate?.value),
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        regionHeadMasterService
          .createRegionHeadMaster(obj)
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
        const updatePayload = { ...obj, regionHeadId: stateData?.id };

        regionHeadMasterService
          .updateRegionHeadMaster(updatePayload)
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
    regionHeadMasterService
      .deactivateRegionHeadMaster({ ...patchData, loggedInUserId,deactivationDate:deactForm.deactivationDate.value })
      .then((response) => {
        setLoader(false);
        setShowConfirmDialogue(false);
       if(response.statusCode === 200){
        closeDeactivation();
        ToasterService.show(
          `Region Head record ${patchData?.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      }
      })
      .catch((error) => {
        setLoader(false);
        return false;
      });
  };

  const closeFormPopup = () => {
    setFormPopup(false);
    setIsEditCompanyLocation(false);
    setStateData({});
    setCompanyLocationFieldStructure(_.cloneDeep(CompanyLocationFormFields));
    setCompanyLocationForm(_.cloneDeep(CompanyLocationFormFields));
    // setAdditionalDetailsForm({});
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
          label="Add New Region Head"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={companyLocationMaster}
          column={CompanyLocationMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Region_Head"}
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
                <h4 className="popup-heading">{isEditCompanyLocation ? 'Update' : 'Add New'} Region Head</h4>
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
                form={_.cloneDeep(CompanyLocationForm)}
                formUpdateEvent={companyLocationFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewCompanyLocation}
              />
            </div>
          </div>
        </div>
      ) : null}

{deactivatePopup ? (
      <div className="popup-overlay md-popup-overlay">
        <div style={{maxWidth:'360px'}} className="popup-body md-popup-body stretchLeft">
          <div className="popup-header">
            <div
              className="popup-close"
              onClick={() => {
   
                closeDeactivation()
              }}
            >
              <i className="pi pi-angle-left"></i>
              <h4 className="popup-heading">Deactivate Region Head</h4>
            </div>
            <div
              className="popup-right-close"
              onClick={() => {
                closeDeactivation()
            
              }}
            >
              &times;
            </div>
          </div>
          <div className="popup-content"  style={{paddingBottom:'0rem',maxHeight:"calc(100vh - 535px)" }}>
            <FormComponent
              form={_.cloneDeep(deactForm)}
              formUpdateEvent={deactivationFormHandler}
              isFormValidFlag={isDeactivateFormValid}
            ></FormComponent>
          </div>

          <div className="popup-lower-btn">
            <ButtonComponent
              label="Submit"
              icon="pi pi-check"
              iconPos="right"
              submitEvent={submitDeactivateFormHandler}
            />
          </div>
        </div>
      </div>
    ) : null}

    </>
  );
};

export default RegionHeadMaster;
