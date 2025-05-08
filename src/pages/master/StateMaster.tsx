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
import moment from "moment";
import { ValidationRegex } from "../../constants/ValidationRegex";

const StateMaster = () => {
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
    stateName: {
      inputType: "inputtext",
      label: "State",
      value: null,
      validation: {
        required: true,
        pattern:ValidationRegex.onlyCharacters.pattern,
        patternHint:ValidationRegex.onlyCharacters.patternHint
      },
      fieldWidth: "col-md-6",
    },
    stateCode: {
      inputType: "inputtext",
      label: "State Code",
      value: null,
      validation: {
        required: false,
        pattern:ValidationRegex.onlyCharacters.pattern,
        patternHint:ValidationRegex.onlyCharacters.patternHint
      },
      fieldWidth: "col-md-6",
    },
    gstCode: {
      inputType: "inputNumber",
      label: "GST Code",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [stateMaster, setStateMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditState, setIsEditState] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statesFieldsStructure, setStatesFieldsStructure]: any =
    useState(StatesFormFields);
  const [StatesForm, setStatesForm] = useState<any>(
    _.cloneDeep(statesFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const countryService = new CountryMasterService();
  const stateService = new StateMasterService();

  const StateMasterColumns = [
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
          {/* <span
            className={`pi pi-${rowData.isactive ? "ban" : "check-circle"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isactive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span> */}
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
            // data-pr-tooltip={rowData.state_name}
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
      label: "State Code",
      fieldName: "stateCode",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "stateCode",
      changeFilter: true,
      placeholder: "State Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.stateCode}
          >
            {rowData.stateCode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "GST Code",
      fieldName: "gstCode",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "gstCode",
      changeFilter: true,
      placeholder: "GST Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.stateCode}
          >
            {rowData.gstCode}
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
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getStateMaster();
      const countries = await getCountryMaster();
      await formatCountryDetails(countries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getStateMaster = async () => {
    setLoader(true);
    try {
      const response = await stateService.getStateMaster();
      response?.states?.forEach((el: any) => {
        el.updated_at = el?.updated_at ? moment(el?.updated_at).format("DD-MM-YYYY HH:mm:ss") : null
       })
      setStateMaster(response?.states);
      return response?.states;
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

  const formatCountryDetails = async (countries: any = countryMaster) => {
    const countrylist = countries.map((country: any) => country?.name);
    statesFieldsStructure.country_name.options = countrylist;
    await setStatesFieldsStructure(statesFieldsStructure);
    await statesFormHandler(statesFieldsStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const statesFormHandler = async (form: FormType) => {
    setStatesForm(form);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateStateMaster(data);
    setFormPopup(true);
    setIsEditState(true);
  };
  
  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateStateMaster = (data: any) => {
    try {
      statesFieldsStructure.country_name.value = data?.name;
      statesFieldsStructure.stateName.value = data?.stateName;
      statesFieldsStructure.stateCode.value = data?.stateCode;
      statesFieldsStructure.gstCode.value = Number(data?.gstCode);

      setStatesForm(_.cloneDeep(statesFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewState = (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true); 
    try{
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(StatesForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.value;
      }
    });

    setIsFormValid(companyValidityFlag);

    const countryId =
      countryMaster.find(
        (country: any) => country.name === StatesForm.country_name.value
      )?.id ?? null;

    if (companyValidityFlag) {
      const obj = {
        stateName: StatesForm?.stateName?.value,
        stateCode: StatesForm?.stateCode?.value,
        gstCode: StatesForm?.gstCode?.value,
        countryId: countryId,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        stateService
          .createStateMaster(obj)
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
        const updatePayload = { ...obj, stateId: stateData?.id };

        stateService
          .updateStateMaster(updatePayload)
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
    }
    finally{
      setIsSubmitting(false); 
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
          `State record ${
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

  const closeFormPopup = () => {
    setFormPopup(false);
    setIsEditState(false);
    setStateData({});
    setStatesFieldsStructure(_.cloneDeep(StatesFormFields));
    setStatesForm(_.cloneDeep(StatesFormFields));
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
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"States"}
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
                <h4 className="popup-heading">{isEditState ? 'Update' : 'Add New'} State</h4>
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
                icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                iconPos="right"
                submitEvent={createNewState}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StateMaster;
