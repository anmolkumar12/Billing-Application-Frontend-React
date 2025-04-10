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
import moment from "moment";

import CurrencyMasterService from "../../services/masters/currency-master/currency.service";

const CurrencyMaster = () => {
  const formObj = {
    currencyCode: {
      inputType: "inputtext",
      label: "Code",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    description: {
      inputType: "inputtext",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };

  const [currencyMaster, setCurrencyMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [rowData, setRowData] = useState<any>({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [currencyHistoryPopup, setCurrencyHistoryPopup] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [formObjState, setFormObjState] = useState<any>(_.cloneDeep(formObj));

  const [currencyHistoryData, setCurrencyHistoryData] = useState<any>([]);

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  const currencyService = new CurrencyMasterService();

  const showThisCurrencyCodeHistory = async (currencyCode: any) => {
    setCurrencyHistoryPopup(true);
    try {
      const response = await currencyService.getCurrencyHistoryData({
        currencyCode: currencyCode,
      });
      setCurrencyHistoryData(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getExchangeRateValueWithOneUnit = (data: any) => {
    return data.exchangeRate ? (
      <span
        // className="clickable-span"
        // onClick={() => showThisCurrencyCodeHistory(data.currencyCode)}
      >
        {(1 / data.exchangeRate).toFixed(4)}
      </span>
    ) : (
      "NA"
    );
  };

  const currencyMasterColumns = [
    // {
    //   label: "Action",
    //   fieldName: "action",
    //   textAlign: "left",
    //   body: (rowData: any) => (
    //     <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
    //       <span
    //         className="pi pi-pencil"
    //         style={{ cursor: "pointer" }}
    //         title="Update"
    //         onClick={() => onUpdate(rowData)}
    //       ></span>
    //       <span
    //         className={`pi pi-${rowData.isActive ? "ban" : "check-circle"}`}
    //         style={{ cursor: "pointer" }}
    //         title={rowData.isActive ? "Deactivate" : "Activate"}
    //         onClick={() => onDelete(rowData)}
    //       ></span>
    //     </div>
    //   ),
    // },
    {
      label: "Currency Code",
      fieldName: "currencyCode",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "currencyCode",
      changeFilter: true,
      placeholder: "Currency Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.techName}
          >
            {rowData.currencyCode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    // {
    //   label: "Description",
    //   fieldName: "description",
    //   textAlign: "left",
    //   sort: true,
    //   filter: true,
    //   fieldValue: "description",
    //   changeFilter: true,
    //   placeholder: "Description",
    //   body: (rowData: any) => (
    //     <div>
    //       <span
    //         id={`companyNameTooltip-${rowData.id}`}
    //         // data-pr-tooltip={rowData.description}
    //       >
    //         {rowData.description}
    //       </span>
    //       <Tooltip
    //         target={`#companyNameTooltip-${rowData.id}`}
    //         position="top"
    //       />
    //     </div>
    //   ),
    // },
    {
      label: "Exchange Rate In INR",
      fieldName: "exchangeRate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "exchangeRate",
      changeFilter: true,
      placeholder: "Exchange Rate In Rs",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.description}
          >
            {rowData?.exchangeRateInINR || 'NA'}
            {/* {getExchangeRateValueWithOneUnit(rowData)} */}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },

    {
      label: "Date",
      fieldName: "isActive",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span>
          {rowData.updated_at}
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

  const currencyHistoryColumns = [
    {
      label: "Currency Code",
      fieldName: "currencyCode",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "currencyCode",
      changeFilter: true,
      placeholder: "Currency Code",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.techName}
          >
            {rowData.currencyCode}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },

    {
      label: "Exchange Rate In INR",
      fieldName: "exchangeRate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "exchangeRate",
      changeFilter: true,
      placeholder: "Exchange Rate In Rs",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.description}
          >
            {rowData?.exchangeRateInINR || 'NA'}
            {/* {getExchangeRateValueWithOneUnit(rowData)} */}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },

    {
      label: "Date",
      fieldName: "isActive",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span>
           {rowData.updated_at}
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getCurrencyMaster();
  }, []);

  const getCurrencyMaster = async () => {
    try {
      const response = await currencyService.getCurrencyMasterData();
      if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        closeFormPopup();
        response.data.forEach((element: any) => {
          element.exchangeRateInINR = (1 / element?.exchangeRate).toFixed(4);
          element.updated_at = moment(rowData.updated_at).format('DD-MM-YYYY HH:mm:ss');
        });
        const formattedDataForExcel = response?.data.map(({ exchangeRate, ...rest }: any) => rest);
        console.log('response.data', formattedDataForExcel);
        setCurrencyMaster(formattedDataForExcel);
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
  };

  const openSaveForm = () => {
    setRowData(null);
    setFormPopup(true);
  };

  const currencyHandler = async (form: FormType) => {
    const updatedForm = { ...form };
    setFormObjState(updatedForm);
  };

  const onUpdate = async (data: any) => {
    setRowData(data);
    updateCurrencyMaster(data);
    setFormPopup(true);
  };

  const onPopUpClose = () => {
    setShowConfirmDialogue(false);
  };

  const updateCurrencyMaster = (data: any) => {
    formObjState.currencyCode.value = data.currencyCode;
    formObjState.description.value = data.description;
  };

  const createNewRecord = async (event: FormEvent) => {
    event.preventDefault();
    const obj: any = {
      currencyCode: formObjState?.currencyCode?.value,
      description: formObjState?.description?.value,
      isActive: 1,
      updatedBy: loggedInUserId,
    };
    if (rowData?.id) {
      obj["id"] = rowData.id;
    }
    try {
      const response = await currencyService.createCurrencyMasterData(obj);
      if (
        response?.statusCode === HTTP_RESPONSE.CREATED ||
        response?.statusCode === HTTP_RESPONSE.SUCCESS
      ) {
        closeFormPopup();
        getCurrencyMaster();
        ToasterService.show(response?.message, CONSTANTS.SUCCESS);
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
  };

  const onDelete = (data: any) => {
    setActionPopupToggle({
      title: "Delete",
      message: `Are you sure you want to ${
        data?.isActive ? "deactivate" : "activate"
      } this record?`,
      acceptFunction: () => confirmDelete(data),
      rejectFunction: onPopUpClose,
    });
    setShowConfirmDialogue(true);
  };

  const confirmDelete = (data: any) => {
    setLoader(true);
    currencyService
      .activateDeactivateCurrencyMaster({
        id: data.id,
        isActive: data.isActive === 0 ? 1 : 0,
        loggedInUserId: loggedInUserId,
      })
      .then(() => {
        setLoader(false);
        getCurrencyMaster();
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Currency record ${
            data.isActive ? "deactivated" : "activated"
          } successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const closeFormPopup = () => {
    setFormPopup(false);
    setFormObjState(_.cloneDeep(formObj));
  };

  return loader ? (
    <Loader />
  ) : (
    <>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "0.5em",
        }}
      >
        <ButtonComponent
          label="Add New Currency"
          icon="pi pi-plus"
          submitEvent={openSaveForm}
        />
      </div> */}
      <p className="m-0">
        <DataTableBasicDemo
          data={currencyMaster}
          column={currencyMasterColumns}
          showGridlines
          resizableColumns
          rows={20}
          paginator
          scrollHeight={"calc(100vh - 150px)"}
          sortable
          headerRequired
          downloadedfileName={"Currency_Table"}
        />
        {showConfirmDialogue && (
          <ConfirmDialogue
            actionPopupToggle={actionPopupToggle}
            onCloseFunction={onPopUpClose}
          />
        )}
      </p>
      {storeFormPopup && (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body">

            <div className="popup-header">
              <div
                className="popup-close"
                onClick={() => {
                  closeFormPopup();
                }}
              >
                <i className="pi pi-angle-left"></i>
                <h4 className="popup-heading">{rowData ? "Update" : "Add New"} Currency</h4>
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
            <div className="popup-content">
              <FormComponent
                form={_.cloneDeep(formObjState)}
                formUpdateEvent={currencyHandler}
                isFormValidFlag={isFormValid}
              />
            </div>
            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                submitEvent={createNewRecord}
              />
            </div>
          </div>
        </div>
      )}

      {currencyHistoryPopup && (
        <div className="popup-overlay md-popup-overlay">
          <div className="popup-body md-popup-body">
            <div className="popup-header">
              <h4 className="popup-heading"> Exchange Rate History</h4>
              <span
                className="popup-close"
                onClick={() => setCurrencyHistoryPopup(false)}
              >
                &times;
              </span>
            </div>
            <div className="popup-content">
              <p className="m-0">
                <DataTableBasicDemo
                  data={currencyHistoryData}
                  column={currencyHistoryColumns}
                  showGridlines
                  resizableColumns
                  rows={20}
                  paginator
                  sortable
                  headerRequired
                />
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrencyMaster;
