import React, { FormEvent, useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ui/button/Button";
import DataTableBasicDemo from "../../components/ui/table/Table";
import ConfirmDialogue from "../../components/ui/confirm-dialogue/ConfirmDialogue";
import FormComponent from "../../components/ui/form/form";
import classes from "./Master.module.scss";
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
import { RegionMasterService } from "../../services/masters/region-master/region.service";
import moment from "moment";

const RegionMaster = () => {
  const RegionFormFields = {
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
    // regionHeadName: {
    //   inputType: "inputtext",
    //   label: "Region Head Name",
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   fieldWidth: "col-md-4",
    // },
    // regionHeadEcode: {
    //   inputType: "inputtext",
    //   label: "Region Head Ecode",
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   fieldWidth: "col-md-4",
    // },
    // regionHeadEmail: {
    //   inputType: "inputtext",
    //   label: "Region Head Email",
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   fieldWidth: "col-md-4",
    // },
    fromDate: {
      inputType: "singleDatePicker",
      label: "From Date",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    }
    
  };
  const [statesList,setStatesList] = useState<any>([]);
  const StateSelectionFormFields = {
    name: {
      inputType: "inputtext",
      label: "Region Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    code: {
      inputType: "inputtext",
      label: "Region Code",
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
      options: statesList,
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
  };
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [stateMaster, setStateMaster] = useState<any>([]);
  const [regionMaster, setRegionMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditRegion, setIsEditRegion] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [regionFieldsStructure, setRegionFieldsStructure]: any =
    useState(RegionFormFields);
  const [stateSelectionFieldsStructure, setStateSelectionFieldsStructure]: any =
    useState(StateSelectionFormFields);
  const [RegionForm, setRegionForm] = useState<any>(
    _.cloneDeep(regionFieldsStructure)
  );
  const [StateSelectionForm, setStateSelectionForm] = useState<any>([]);

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const countryService = new CountryMasterService();
  const stateService = new StateMasterService();
  const regionService = new RegionMasterService();

  const RegionMasterColumns = [
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
            className={`pi pi-${rowData.isactive ? "ban" : "check-circle"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isactive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
        </div>
      ),
    },
    {
      label: "Region",
      fieldName: "regionName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "regionName",
      changeFilter: true,
      placeholder: "State",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.region_name}
          >
            {rowData.regionName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Region Code",
      fieldName: "regionCode",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "regionCode",
      changeFilter: true,
      placeholder: "Region Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.regionCode}
          >
            {rowData.regionCode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    // {
    //   label: "Region Head Name",
    //   fieldName: "regionHeadName",
    //   textAlign: "left",
    //   sort: true,
    //   filter: true,
    //   fieldValue: "regionHeadName",
    //   changeFilter: true,
    //   placeholder: "Region Head Name",
    //   body: (rowData: any) => (
    //     <div>
    //       <span
    //         id={`companyNameTooltip-${rowData.id}`}
    //         // data-pr-tooltip={rowData.regionHeadName}
    //       >
    //         {rowData.regionHeadName}
    //       </span>
    //       <Tooltip
    //         target={`#companyNameTooltip-${rowData.id}`}
    //         position="top"
    //       />
    //     </div>
    //   ),
    // },
    // {
    //   label: "Region Head Ecode",
    //   fieldName: "regionHeadEcode",
    //   textAlign: "left",
    //   sort: true,
    //   filter: true,
    //   fieldValue: "regionHeadEcode",
    //   changeFilter: true,
    //   placeholder: "Region Head Ecode",
    //   body: (rowData: any) => (
    //     <div>
    //       <span
    //         id={`companyNameTooltip-${rowData.id}`}
    //         // data-pr-tooltip={rowData.regionHeadEcode}
    //       >
    //         {rowData.regionHeadEcode}
    //       </span>
    //       <Tooltip
    //         target={`#companyNameTooltip-${rowData.id}`}
    //         position="top"
    //       />
    //     </div>
    //   ),
    // },
    // {
    //   label: "Region Head Email",
    //   fieldName: "regionHeadEmail",
    //   textAlign: "left",
    //   sort: true,
    //   filter: true,
    //   fieldValue: "regionHeadEmail",
    //   changeFilter: true,
    //   placeholder: "Region Head Email",
    //   body: (rowData: any) => (
    //     <div>
    //       <span
    //         id={`companyNameTooltip-${rowData.id}`}
    //         // data-pr-tooltip={rowData.regionHeadEmail}
    //       >
    //         {rowData.regionHeadEmail}
    //       </span>
    //       <Tooltip
    //         target={`#companyNameTooltip-${rowData.id}`}
    //         position="top"
    //       />
    //     </div>
    //   ),
    // },
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
      label: "States",
      fieldName: "stateNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "stateNames",
      changeFilter: true,
      placeholder: "State Names",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.stateNames}
          >
            {rowData.stateNames}
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
      label: "Status",
      fieldName: "isactive",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span style={{ color: rowData?.isactive === 1 ? "green" : "red" }}>
            {rowData?.isactive === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getRegionMaster();
      const countries = await getCountryMaster();
      await formatCountryDetails(countries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getRegionMaster = async () => {
    setLoader(true);
    try {
      const response = await regionService.getRegionMaster();
      setRegionMaster(response?.regions);
      return response?.states;
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
      return response?.states;
    } catch (error) {
      console.error(error);
    } finally {
      //   setLoader(false);
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

  const formatCountryDetails = async (countries: any = countryMaster) => {
    const countrylist = countries.map((country: any) => country?.name);
    regionFieldsStructure.country_name.options = countrylist;
    await setRegionFieldsStructure(regionFieldsStructure);
    await regionFormHandler(regionFieldsStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const getStateByCountry = async (countryName: any) => {
    const selectedCountry =
      countryMaster.find((country: any) => country?.name === countryName) ??
      null;
    const states = await getStateMaster(selectedCountry?.id);
    const statelist = states.map((state: any) => state?.stateName);
    stateSelectionFieldsStructure.state_name.options = statelist;
    await setStateSelectionFieldsStructure(stateSelectionFieldsStructure);
    setStatesList(statelist);
    return statelist;
  };

  const regionFormHandler = async (currentForm: FormType) => {
    const form = _.cloneDeep(currentForm);
    setRegionForm(form);
    if (RegionForm?.country_name?.value != form?.country_name?.value) {
      await getStateByCountry(form?.country_name?.value);
      setStateSelectionForm([]);
    }
  };

  const stateOptionModifier = (
    updatedSelectionForm: any,
    regionCountryForm: any,
    statelist: any
  ) => {
    const selectedCountry = countryMaster?.find(
      (item: any) => item?.name == regionCountryForm?.country_name?.value
    );

    const selectedStates = updatedSelectionForm
      .map((item: any) => item?.state_name?.value)
      .flat()
      .filter(Boolean);

    updatedSelectionForm.forEach((item: any, idx: any) => {
      const availableStates = statelist.filter(
        (state: any) =>
          !selectedStates.includes(state) ||
          (item?.state_name?.value && item?.state_name?.value.includes(state))
      );
      updatedSelectionForm[idx] = {
        ...item,
        code: {
          ...item.code,
          value:
            item?.name?.value != null && item?.name?.value?.length > 0
              ? item?.name?.value + " " + selectedCountry?.code
              : null,
        },
        state_name: {
          ...item.state_name,
          options: availableStates,
          value:
            item?.state_name?.value?.length > 0
              ? item?.state_name?.value
              : null,
        },
      };
    });
    return updatedSelectionForm;
  };

  const stateSelectionFormHandler = async (
    form: FormType,
    index: any,
    stateForm: any = StateSelectionForm
  ) => {
    const updatedSelectionForm = [...stateForm];
    updatedSelectionForm[index] = form;

    const statelist = stateMaster?.map((state: any) => state?.stateName);
    const modifiedSelectionForm = stateOptionModifier(
      [...updatedSelectionForm],
      RegionForm,
      statelist
    );
    setStateSelectionForm(modifiedSelectionForm);
  };

  const onUpdate = async (data: any) => {
    const allRegionRows = regionMaster?.filter(
      (item: any) => item?.countryName == data?.countryName
    );
    console.log('rrrrrrrrrrrr',regionMaster, allRegionRows, data);
    const stateList = await getStateByCountry(data?.countryName);
    
    setStateData(allRegionRows);
    updateStateMaster(data, allRegionRows, stateList);
    setFormPopup(true);
    setIsEditRegion(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateStateMaster = (
    data: any,
    stateSelectionData: any,
    stateList: any
  ) => {
    try {
      console.log('data-->',data)
      regionFieldsStructure.country_name.value = data?.countryName;
      // regionFieldsStructure.regionHeadName.value = data?.regionHeadName;
      // regionFieldsStructure.regionHeadEcode.value = data?.regionHeadEcode;
      // regionFieldsStructure.regionHeadEmail.value = data?.regionHeadEmail;
      // regionFieldsStructure.fromDate.value = data?.fromDate;
      regionFieldsStructure.fromDate.value = parseDateString(data?.fromDate);

      setRegionForm(_.cloneDeep(regionFieldsStructure));
      const stateForm: any = [];
      stateSelectionData?.forEach((item: any, index: any) => {
        const selectedState = item?.stateNames?.split(",");
        const formFilling = {
          name: {
            inputType: "inputtext",
            label: "Region Name",
            value: item.regionName,
            validation: {
              required: true,
            },
            fieldWidth: "col-md-4",
          },
          code: {
            inputType: "inputtext",
            label: "Region Code",
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
            options: stateList,
            value: selectedState,
            validation: {
              required: true,
            },
            fieldWidth: "col-md-4",
          },
        };
        stateForm.push(formFilling);
      });
      const modifiedStateForm = stateOptionModifier(
        [...stateForm],
        regionFieldsStructure,
        stateList
      );
      setStateSelectionForm(modifiedStateForm);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddStateSelection = () => {
    setStateSelectionForm((prev: any) => {
      return [...prev, stateSelectionFieldsStructure];
    });
  };

  const handleSubStateSelection = () => {
    setStateSelectionForm((prev: any) => {
      return prev.slice(0, prev.length - 1);
    });
  };

  const formatDate = (dateString: any) => {
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

  const createNewRegion = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;

    _.each(RegionForm, (item: any) => {
      if (item?.validation?.required) {
        companyValidityFlag = companyValidityFlag && item.value;
      }
    });
    console.log('companyValidityForm------> first',companyValidityFlag, RegionForm);
    console.log('companyValidityForm------> seconddd', StateSelectionForm);

    if (StateSelectionForm?.length > 0) {
      console.log("here StateSelectionForm", StateSelectionForm);

      const selectedStates = StateSelectionForm.map(
        (item: any) => item?.state_name?.value
      )
        .flat()
        .filter(Boolean);
      const remainingStates = stateMaster?.length - selectedStates?.length;
      console.log("here remainingStates", remainingStates, StateSelectionForm);
      
      if (remainingStates > 0) {
        ToasterService.show("Assign Region to all States", CONSTANTS.ERROR);
        return;
      }
      StateSelectionForm?.map((region: any) => {
        _.each(region, (item: any) => {
          if (item?.validation?.required) {
            companyValidityFlag = companyValidityFlag && item.value != null && item.value != "";
          }
        });
      });
      console.log("here StateSelectionForm", StateSelectionForm);
    } else {
      ToasterService.show("Assign Region to all States", CONSTANTS.ERROR);
      return;
    }
    console.log('companyValidityForm------>',companyValidityFlag);

    setIsFormValid(companyValidityFlag);

    const countryId =
      countryMaster.find(
        (country: any) => country.name === RegionForm.country_name.value
      )?.id ?? null;

    if (companyValidityFlag) {
      StateSelectionForm?.map((region: any, index: any) => {
        let ids = "";
        region?.state_name?.value?.forEach((item: any) => {
          const id =
            stateMaster?.find((state: any) => state?.stateName == item)?.id ??
            null;
          if (id != null) {
            ids = ids != "" ? ids + "," + id : id;
          }
        });
        const obj = {
          regionName: region?.name?.value,
          regionCode: region?.code?.value,
          countryId: countryId,
          // regionHeadName:RegionForm?.regionHeadName?.value,
          // regionHeadEcode:RegionForm?.regionHeadEcode?.value,
          // regionHeadEmail:RegionForm?.regionHeadEmail?.value,
          // fromDate:new Date(RegionForm?.fromDate?.value),
          fromDate: formatDate(RegionForm?.fromDate?.value),
          stateIds: ids,
          isActive: 1,
          updatedBy: loggedInUserId,
        };
        console.log('jjjjjjjjjjjjjjjjjjjj', stateData);
        
        if (stateData?.length && stateData[index]?.id) {
          const updatePayload = { ...obj, regionId: stateData[index]?.id };

          regionService
            .updateRegionMaster(updatePayload)
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
        } else {
          regionService
            .createRegionMaster(obj)
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
        }
      });
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
    stateService
      .deactivateStateMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Region record ${
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
    setIsEditRegion(false);
    setStateData({});
    setRegionFieldsStructure(_.cloneDeep(RegionFormFields));
    setStateSelectionFieldsStructure(_.cloneDeep(StateSelectionFormFields));
    setRegionForm(_.cloneDeep(RegionFormFields));
    setStateSelectionForm([]);
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
          label="Add New Region"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={regionMaster}
          column={RegionMasterColumns}
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
                <h4 className="popup-heading">{isEditRegion ? 'Update' : 'Add New'} Region</h4>
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
                form={_.cloneDeep(RegionForm)}
                formUpdateEvent={regionFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
              {/* attachment */}
              <div className={classes["upload-wrapper"]}>
                <div className="row">
                  <div
                    className={`col-md-12 ${classes["addition-field-header"]}`}
                  >
                    <h5 className="popup-heading">Add More Regions</h5>
                    <div className={classes["addition-field-buttons"]}>
                      <div
                        className="popup-right-close"
                        onClick={() => {
                          handleSubStateSelection();
                        }}
                      >
                        -
                      </div>
                      <div
                        className="popup-right-close"
                        onClick={() => {
                          handleAddStateSelection();
                        }}
                      >
                        +
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    {StateSelectionForm?.length > 0 &&
                      StateSelectionForm?.map((item: any, index: any) => (
                        <FormComponent
                          form={_.cloneDeep(item)}
                          formUpdateEvent={(form: FormType) =>
                            stateSelectionFormHandler(form, index)
                          }
                          isFormValidFlag={isFormValid}
                        ></FormComponent>
                      ))}
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
                submitEvent={createNewRegion}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RegionMaster;
