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

const CompanyAddressMaster = () => {
  const [stateData, setStateData] = useState<any>();
  const CompanyLocationFormFields = {
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
      disable: true,
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
    companyCode: {
      inputType: "inputtext",
      label: "Company Code",
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

  const CompanyLocationMasterColumns = [
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
      label: "State",
      fieldName: "stateName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "stateName",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.stateName}
          >
            {rowData.stateName}
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
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.address}
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
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.address}
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
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.address}
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
      label: "Additional Address Details",
      fieldName: "additionalAddressDetails",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "additionalAddressDetails",
      changeFilter: true,
      placeholder: "Additional Address Details",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.additionalAddressDetails}
          >
            {rowData.additionalAddressDetails}
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
      await getCompanyLocationMaster();
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
      setCompanyLocationMaster(response?.locations);
      return response?.locations;
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

  const getStateMaster = async (countryId: any) => {
    // setLoader(true);
    try {
      const response = await stateService.getStateMaster(countryId);
      setStateMaster(response?.states);
      await formatStateDetails(response?.states);
      return response?.states;
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
      if (selectedCountry) {
        form.country_name.value = selectedCompany?.countryName;
        const stateList = await getStateMaster(selectedCountry?.id);
        if (stateList) {
          const stateNames = stateList?.map((state: any) => state.stateName);
          form.state_name.options = stateNames || [];
          form.state_name.value = null;
        }
        const addressDetails = JSON.parse(
          selectedCountry?.addressAdditionalFields
        );
        const detailsForm = Object.keys(addressDetails)?.reduce(
          (acc: any, item: any, index: any) => {
            acc[index] = {
              inputType: "inputtext",
              label: addressDetails[item],
              value: null,
              validation: {
                required: true,
              },
              fieldWidth: "col-md-4",
            };
            return acc;
          },
          {}
        );
        setAdditionalDetailsForm(detailsForm);
      }
    }
    setCompanyLocationForm(form);
  };

  const additionalDetailsFormHandler = async (form: FormType) => {
    setAdditionalDetailsForm(form);
  };

  const onUpdate = async (data: any) => {
    setStateData(data);
    const selectedCountry = countryMaster?.find(
        (item: any) => item?.name == data?.countryName
      );
    const stateList = await getStateMaster(selectedCountry?.id);
    const stateNames = stateList?.map((state: any) => state.stateName);
    updateCompanyLocationMaster(data, stateNames);
    setFormPopup(true);
    setIsEditCompanyLocation(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateCompanyLocationMaster = async (data: any, stateNames: any[]) => {
    try {
      companyLocationFieldStructure.companyName.value = data?.companyName;
      companyLocationFieldStructure.companyName.disable = true;
      companyLocationFieldStructure.country_name.value = data?.countryName;
      companyLocationFieldStructure.state_name.options = stateNames;
      companyLocationFieldStructure.state_name.value = data?.stateName;
      companyLocationFieldStructure.address1.value = data?.address1;
      companyLocationFieldStructure.companyCode.value = data?.companyCode;
      companyLocationFieldStructure.address2.value = data?.address2;
      companyLocationFieldStructure.address3.value = data?.address3;
      setCompanyLocationForm(_.cloneDeep(companyLocationFieldStructure));
      const addressDetails = JSON.parse(data?.additionalAddressDetails);
      const addressForm = Object.keys(addressDetails)?.reduce(
        (acc: any, item: any, index: any) => {
          acc[index] = {
            inputType: "inputtext",
            label: item,
            value: addressDetails[item],
            validation: {
              required: false,
            },
            fieldWidth: "col-md-4",
          };
          return acc;
        },
        {}
      );
      setAdditionalDetailsForm(addressForm);
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewCompanyLocation = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;

    _.each(CompanyLocationForm, (item: any) => {
      if (item?.validation?.required) {
        companyValidityFlag = companyValidityFlag && item.valid;
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

    const stateId =
      stateMaster.find(
        (state: any) =>
          state.stateName === CompanyLocationForm.state_name.value
      )?.id ?? null;

    if (companyValidityFlag) {
      const addressData = Object.keys(AdditionalDetailsForm)?.reduce(
        (acc: any, item: any, index: any) => {
          if (AdditionalDetailsForm[index]?.value != null) {
            acc[AdditionalDetailsForm[index]?.label] =
              AdditionalDetailsForm[index]?.value;
          }
          return acc;
        },
        {}
      );
      const obj = {
        companyId: companyId,
        countryId: countryId,
        stateId: stateId,
        address1: CompanyLocationForm?.address1?.value,
        address2: CompanyLocationForm?.address2?.value,
        address3: CompanyLocationForm?.address3?.value,
        companyCode: CompanyLocationForm?.companyCode?.value,
        additionalAddressDetails: addressData,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        companyService
          .createCompanyLocationMaster(obj)
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
        const updatePayload = { ...obj, locationId: stateData?.id };

        companyService
          .updateCompanyLocationMaster(updatePayload)
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
    companyService
      .deactivateCompanyLocationMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Company Address record ${
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
    setIsEditCompanyLocation(false);
    setStateData({});
    setCompanyLocationFieldStructure(_.cloneDeep(CompanyLocationFormFields));
    setCompanyLocationForm(_.cloneDeep(CompanyLocationFormFields));
    setAdditionalDetailsForm({});
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
          label="Add New Company Location"
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
                <h4 className="popup-heading">{isEditCompanyLocation ? 'Update' : 'Add New'} Company Location</h4>
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
              <FormComponent
                form={_.cloneDeep(AdditionalDetailsForm)}
                formUpdateEvent={additionalDetailsFormHandler}
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
    </>
  );
};

export default CompanyAddressMaster;
