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

import FinancialYearMasterService from "../../services/masters/financial-year-master/financialYearMaster.service";
import { UtilityService } from "../../services/utility-service/utility.service";

const FinancialYearMaster = () => {
  const [yearsRange, setYearsRange] = useState<any>(['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040'])
  const formObj = {
    startYear: {
      inputType: "singleDatePicker",
      label: "Start Date",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",

    },
    financialYearName: {
      inputType: "inputtext",
      label: "Financial Year",
      value: null,
      disable: true,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    // endYear: {
    //     inputType: "singleDatePicker",
    //   label: "End Time",
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   fieldWidth: "col-md-6",

    // },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      message: `Are you sure you want to ${!(data?.isactive || data?.is_active || data?.isActive)
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
      label: "Financial Year",
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
      label: "Start Date",
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
      label: "End Date",
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
    getFinancialYearMaster();
  }, []);

  const getFinancialYearMaster = async () => {
    try {
      const response = await financialYearService.getFinancialYearMasterData();
      if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        closeFormPopup();
        console.log(`this is financial response`,response.records)
        response.records?.forEach((el: any) => {
          el.startYear = el?.startYear ?  moment(el.startYear).format("DD-MM-YYYY") : null;
          el.endYear = el?.endYear ? moment(el.endYear)?.format('DD-MM-YYYY')  : null;
          el.updated_at = el?.updated_at ? moment(el.updated_at).format("DD-MM-YYYY HH:mm:ss") : null;
      });
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
    console.log("fy form: ", form);

    // Extract the startYear value from the form
    const startYear: any = form?.startYear?.value;
    if (startYear) {
      const startYearDate = new Date(startYear); // Convert startYear to a Date object
      const startYearFormatted = startYearDate.getFullYear(); // Extract the year from the start date
      const endYearFormatted = startYearFormatted + 1; // Calculate the end year (next year)

      // Construct the financial year name (e.g., FY 25-26)
      const financialYearName = `FY ${startYearFormatted % 100}-${endYearFormatted % 100}`;

      // Update the form with the calculated values
      const updatedForm = {
        ...form,
        financialYearName: { ...form.financialYearName, value: financialYearName },
      };

      // Set the updated form state
      setFormObjState(updatedForm);
    }
  };


  const onUpdate = async (data: any) => {
    setRowData(data);
    updateFinancialYearMaster(data);
    setFormPopup(true);
  };
  const getRequiredFormat = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const formatDate = (dateString: any) => {
    console.log("dateString",dateString)
    if(!dateString)return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // const parseDateString = (dateString: any) => {
  //   if (!dateString) return new Date();
  //   const date: any = new Date(dateString);
  //   if (isNaN(date)) return new Date();
  //   const year = date.getFullYear();
  //   const month: any = String(date.getMonth() + 1).padStart(2, "0");
  //   const day: any = String(date.getDate()).padStart(2, "0");
  //   return new Date(year, month - 1, day);
  // };
  const parseDateString = (dateString: any) => {
    // Return null if no date string is provided
    if (!dateString || dateString === "null") return null;
    
    // If the date is already a Date object, return it
    if (dateString instanceof Date) return dateString;
    
    // Handle DD-MM-YYYY format
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const [day, month, year] = dateString.split('-').map(num => parseInt(num, 10));
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month - 1, day);
            // Validate if the date is valid
            if (isValidDate(date)) {
                return date;
            }
        }
    }
    
    // Try standard date parsing as fallback
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
};

  // Helper function to validate dates
  const isValidDate = (date: Date) => {
    return date instanceof Date && !isNaN(date.getTime());
};

  const updateFinancialYearMaster = (data: any) => {
    console.log('data there --->', data)
    formObjState.financialYearName.value = data.financialYearName;
    formObjState.startYear.value = parseDateString(data.startYear)
    // formObjState.startYear.value = new Date(data.startYear)
    // data.startYear.toString();
    // formObjState.endYear.value = new Date(data.endYear);
    // formObjState.description.value = data.description;
  };

  const createNewRecord = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true); // Set loading state to true

    // Extract startYear from the form state
    const startYear = formObjState?.startYear?.value;

    // Check if startYear is null
    if (!startYear) {
        ToasterService.show("Please Check all the Fields!", CONSTANTS.ERROR);
        setIsSubmitting(false); // Reset loading state
        return; // Exit the function early
    }

    // Calculate financialYearName and format endYear if startYear is provided
    let financialYearName = "";
    let endYear:any = "";

    if (startYear) {
      const startYearDate = new Date(startYear); // Convert to Date object
      const startYearFormatted = startYearDate.getFullYear(); // Extract year
      const endYearFormatted = startYearFormatted + 1; // Calculate next year

      // Construct financialYearName
      // financialYearName = `FY ${startYearFormatted % 100}-${endYearFormatted % 100}`;

      // Calculate endYear as 31/03 of the next year and format it
      const calculatedEndYear = new Date(`03/31/${endYearFormatted}`);
      endYear = formatDate(calculatedEndYear.toISOString());
    }

    const obj: any = {
      financialYearName: formObjState?.financialYearName?.value,
      startYear: formatDate(formObjState?.startYear?.value),
      endYear: endYear,
      //   description: formObjState?.description?.value,
      isActive: 1,
      updatedBy: loggedInUserId,
    };
    if (rowData && rowData?.id) {
      obj["id"] = rowData.id;
    }
    console.log('object----->', obj);
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
    } finally {
      setIsSubmitting(false); // Set loading state back to false
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
          downloadedfileName={"Financial_Year"}
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
                icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                iconPos="right"
                submitEvent={createNewRecord}
                disabled={isSubmitting} // Disable the button while submitting
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FinancialYearMaster;
