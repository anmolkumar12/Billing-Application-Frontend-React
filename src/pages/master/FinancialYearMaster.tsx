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

import FinancialYearMasterService from "../../services/masters/financial-year-master/financialYearMaster.service";
import { UtilityService } from "../../services/utility-service/utility.service";

const FinancialYearMaster = () => {
    const [yearsRange,setYearsRange] = useState<any>(['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040']) 
  const formObj = {
    financialYearName: {
      inputType: "inputtext",
      label: "Financial Year Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    startYear: {
        inputType: "singleDatePicker",
        label: "Start Time",
        value: null,
        validation: {
          required: true,
        },
        fieldWidth: "col-md-6",
      
    },
    endYear: {
        inputType: "singleDatePicker",
      label: "End Time",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    
    },
    // description: {
    //   inputType: "inputtext",
    //   label: "Description",
    //   value: null,
    //   validation: {
    //     required: false,
    //   },
    //   fieldWidth: "col-md-6",
    // },
  };

  const [financialYearMaster, setFinancialYearMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [rowData, setRowData] = useState<any>({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [formObjState, setFormObjState] = useState<any>(_.cloneDeep(formObj));

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");
  const loggedInUserId = userInfo?.userId;

  const financialYearService = new FinancialYearMasterService();

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

    const confirmDelete = (data: any) => {
      setLoader(true);
      financialYearService
        .activateDeactivateFinancialYearMaster({ id: data.id, isActive: data.isActive == 0 ? 1 : 0, loggedInUserId: loggedInUserId })
        .then(() => {
          setLoader(false);
          getFinancialYearMaster();
          setShowConfirmDialogue(false);
          ToasterService.show(
            `Financial year record ${data?.isActive ? "deactivated" : "activated"} successfully`,
            CONSTANTS.SUCCESS
          );
        })
        .catch((error) => {
          setLoader(false);
          return false;
        });
    };

  const onDelete = (data: any) => {
    setActionPopupToggle({
      displayToggle: false,
      title: "Delete",
      message: `Are you sure you want to ${
        !(data?.isactive || data?.is_active || data?.isActive)
          ? "activate"
          : "deactivate"
      } this record?`,
      acceptFunction: () => confirmDelete(data),
      rejectFunction: onPopUpClose,
    });
    setShowConfirmDialogue(true);
  };

  const financialYearColumns = [
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
      label: "Financial Year Name",
      fieldName: "financialYearName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "financialYearName",
      changeFilter: true,
      placeholder: "Financial Year Name",
      body: (rowData: any) => (
        <div>
          <span id={`financialYearNameTooltip-${rowData.id}`}>
            {rowData.financialYearName}
          </span>
          <Tooltip
            target={`#financialYearNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
   
    {
        label: "Start Time",
        fieldName: "startYear",
        textAlign: "left",
        sort: true,
        filter: true,
        fieldValue: "startYear",
        changeFilter: true,
        placeholder: "Start Year",
        body: (rowData: any) => (
          <div>
            <span id={`descriptionTooltip-${rowData.id}`}>
              {rowData.startYear}
            </span>
            <Tooltip
              target={`#descriptionTooltip-${rowData.id}`}
              position="top"
            />
          </div>
        ),
    },
    {
        label: "End Time",
        fieldName: "endYear",
        textAlign: "left",
        sort: true,
        filter: true,
        fieldValue: "endYear",
        changeFilter: true,
        placeholder: "End Year",
        body: (rowData: any) => (
          <div>
            <span id={`descriptionTooltip-${rowData.id}`}>
              {rowData.endYear}
            </span>
            <Tooltip
              target={`#descriptionTooltip-${rowData.id}`}
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
    getFinancialYearMaster();
  }, []);

  const getFinancialYearMaster = async () => {
    try {
      const response = await financialYearService.getFinancialYearMasterData();
      if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        closeFormPopup();
        setFinancialYearMaster(response.records);
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
  };

  const openSaveForm = async () => {
    setRowData(null);
    setFormPopup(true);
  };

  const financialYearHandler = async (form: FormType) => {
    const updatedForm = { ...form };
    setFormObjState(updatedForm);
  };

  const onUpdate = async (data: any) => {
    setRowData(data);
    updateFinancialYearMaster(data);
    setFormPopup(true);
  };
  const getRequiredFormat = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    })
  }

  const updateFinancialYearMaster = (data: any) => {
    console.log('data there --->',data)
    formObjState.financialYearName.value = data.financialYearName;
    formObjState.startYear.value = data.startYear.toString();
    formObjState.endYear.value = data.endYear.toString();
    // formObjState.description.value = data.description;
  };

  const createNewRecord = async (event: FormEvent) => {
    event.preventDefault();
    const obj: any = {
      financialYearName: formObjState?.financialYearName?.value,
      startYear: getRequiredFormat(formObjState?.startYear?.value),
      endYear: getRequiredFormat(formObjState?.endYear?.value),
    //   description: formObjState?.description?.value,
      isActive: 1,
      updatedBy: loggedInUserId,
    };
    if (rowData && rowData?.id) {
      obj["id"] = rowData.id;
    }
    console.log('object----->',obj);
    try {
      const response =
        await financialYearService.createFinancialYearMasterData(obj);
      if (
        response?.statusCode === HTTP_RESPONSE.CREATED ||
        response?.statusCode === HTTP_RESPONSE.SUCCESS
      ) {
        closeFormPopup();
        getFinancialYearMaster();
        ToasterService.show(response?.message, CONSTANTS.SUCCESS);
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
  };

  const closeFormPopup = () => {
    setFormPopup(false);
    setFormObjState(_.cloneDeep(formObj));
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
          label="Add New Financial Year"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={financialYearMaster}
          column={financialYearColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"FinancialYear_Master_Table"}
        />  
        {showConfirmDialogue ? (
          <ConfirmDialogue
            actionPopupToggle={actionPopupToggle}
            onCloseFunction={closeFormPopup}
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
                <h4 className="popup-heading">
                  {rowData ? "Update" : "Add New"} Financial Year
                </h4>
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
                form={_.cloneDeep(formObjState)}
                formUpdateEvent={financialYearHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewRecord}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FinancialYearMaster;
