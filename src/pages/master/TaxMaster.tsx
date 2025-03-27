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

import {TaxMasterService} from "../../services/masters/tax-service-master/taxMaster.service";
import { CountryMasterService } from "../../services/masters/country-master/country.service";
import moment from "moment";

const TaxMaster = () => {
    const [countriesList,setCountriesList] = useState<any>([]);
  const formObj = {
    countryCode: {
        inputType: "singleSelect",  
        label: "Select Country",
        options: countriesList,
        value: null,
        validation: {
          required: true,
        },
        fieldWidth: "col-md-6",
    },
    taxType: {
        inputType: "singleSelect",
        label: "Select Tax Type",
        options: ['Exempt','Export','Intra-State','Inter-State'],
        value: null,
        validation: {
          required: true,
        },
        fieldWidth: "col-md-6",
    },
    taxFieldName: {
      inputType: "inputtext",
      label: "Tax Field Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    taxPercentage: {
      inputType: "inputNumber",
      label: "Tax Percentage",
      value: null,
      validation: {
        required: true,
      },
      inputNumberOptions:{
        mode:'decimal',
        maxFractionDigits:2
      },
      fieldWidth: "col-md-6",
    }
  };

  const [taxMaster, setTaxMaster] = useState<any>([]);
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
  const taxService = new TaxMasterService();
  const countryService = new CountryMasterService()

  const taxMasterColumns = [
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
      label: "Country",
      fieldName: "countryName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "countryName",
      changeFilter: true,
      placeholder: "Country Name",
      body: (rowData: any) => (
        <div>
          <span id={`countryCodeTooltip-${rowData.id}`}>
            {rowData.countryName}
          </span>
          <Tooltip target={`#countryCodeTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
    {
      label: "Tax Type",
      fieldName: "taxType",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "taxType",
      changeFilter: true,
      placeholder: "Tax Type",
      body: (rowData: any) => (
        <div>
          <span id={`taxTypeTooltip-${rowData.id}`}>
            {rowData.taxType}
          </span>
          <Tooltip target={`#taxTypeTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
    {
      label: "Tax Field Name",
      fieldName: "taxFieldName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "taxFieldName",
      changeFilter: true,
      placeholder: "Tax Field Name",
      body: (rowData: any) => (
        <div>
          <span id={`taxFieldNameTooltip-${rowData.id}`}>
            {rowData.taxFieldName}
          </span>
          <Tooltip target={`#taxFieldNameTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
    {
      label: "Tax Percentage",
      fieldName: "taxPercentage",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "taxPercentage",
      changeFilter: true,
      placeholder: "Tax Percentage",
      body: (rowData: any) => (
        <div>
          <span>{rowData.taxPercentage}%</span>
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
  const getCountryList = async () => {
    setLoader(true);
    try {
      const response = await countryService.getCountryMaster();
      console.log('countriesList------>',response?.countries);
      const temp = response?.countries?.filter((item: any) => item?.isactive || item?.isActive)
      const countryList = await temp?.map((item:any) => {
        return {
           label:item.name,
           value:item.id.toString()
        }
     });
      setCountriesList(countryList);
      formObj.countryCode.options = countryList
      setFormObjState(_.cloneDeep(formObj))
      return response?.countries;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCountryList();
    getTaxMaster();
  }, []);

  const getTaxMaster = async () => {
    try {
      const response = await taxService.getTax();
      if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        console.log('response data----> ',response.data);
        response?.data?.forEach((el: any) => {
          el.created_at = el.created_at ?  moment(el.created_at).format("DD-MM-YYYY HH:mm:ss") : null;
          el.updated_at = el.updated_at ?  moment(el.updated_at).format("DD-MM-YYYY HH:mm:ss") : null;
          });
        setTaxMaster(response.data);
        closeFormPopup();
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
  };

  const openSaveForm = async () => {
    setRowData(null);
    setFormPopup(true);
  };

  const taxMasterHandler = async (form: FormType) => {
    const updatedForm = { ...form };
    setFormObjState(updatedForm);
  };

  const onUpdate = async (data: any) => {
    setRowData(data);
    updateTaxMaster(data);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateTaxMaster = (data: any) => {
    formObjState.countryCode.options = countriesList;
    formObjState.countryCode.value = data.countryCode;
    formObjState.taxType.value = data.taxType;
    formObjState.taxFieldName.value = data.taxFieldName;
    formObjState.taxPercentage.value = Number(data.taxPercentage);
  };

  const createNewRecord = async (event: FormEvent) => {
    event.preventDefault();
    const obj: any = {
      countryCode: formObjState?.countryCode?.value,
      taxType: formObjState?.taxType?.value,
      taxFieldName: formObjState?.taxFieldName?.value,
      taxPercentage: formObjState?.taxPercentage?.value,
      isActive: 1,
      updatedBy: loggedInUserId,
    };
    if (rowData && rowData?.id) {
      obj['id'] = rowData.id;
    }
    try {
        console.log('we reached there',obj)
      const response = await taxService.createTax(obj);
      if (response?.statusCode === HTTP_RESPONSE.CREATED || response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        closeFormPopup();
        getTaxMaster();
        ToasterService.show(response?.message, CONSTANTS.SUCCESS);
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
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

  const confirmDelete = (data: any) => {
    setLoader(true);
    taxService
      .activatedeactivateTax({ id: data.id, isActive: data.isActive == 0 ? 1 : 0, loggedInUserId: loggedInUserId })
      .then(() => {
        setLoader(false);
        getTaxMaster();
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Tax record ${data?.isActive ? "deactivated" : "activated"} successfully`,
          CONSTANTS.SUCCESS
        );
      })
      .catch((error:any) => {
        setLoader(false);
        return false;
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
          column={taxMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Tax"}
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
                <h4 className="popup-heading">{rowData?'Update':`Add New`} Tax</h4>
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
                formUpdateEvent={taxMasterHandler}
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

export default TaxMaster;
