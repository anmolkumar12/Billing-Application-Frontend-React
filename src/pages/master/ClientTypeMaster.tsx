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
import { ClientTypeMasterService } from "../../services/masters/client-type/clientType.service";

const ClientTypeMaster = () => {
  const formObj = {
    clientType: {
      inputType: "inputtext",
      label: "Client Type",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
  };

  const [clientTypeMaster, setClientTypeMaster] = useState<any>([]);
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
  const clientTypeService = new ClientTypeMasterService();

  const clientTypeColumns = [
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
      label: "Client Type",
      fieldName: "client_type",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "client_type",
      changeFilter: true,
      placeholder: "Client Type",
      body: (rowData: any) => (
        <div>
          <span id={`clientTypeTooltip-${rowData.id}`}>{rowData.client_type}</span>
          <Tooltip target={`#clientTypeTooltip-${rowData.id}`} position="top" />
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
          <span id={`updatedByTooltip-${rowData.id}`}>{rowData?.updated_by}</span>
          <Tooltip target={`#updatedByTooltip-${rowData.id}`} position="top" />
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
      placeholder: "Updated At",
      body: (rowData: any) => (
        <div>
          <span id={`updatedAtTooltip-${rowData.id}`}>
            {moment(rowData.updated_at).format("YYYY-MM-DD HH:mm:ss")}
          </span>
          <Tooltip target={`#updatedAtTooltip-${rowData.id}`} position="top" />
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
          <span style={{ color: rowData?.isActive === 1 ? "green" : "red" }}>
            {rowData?.isActive === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getClientTypeMaster();
  }, []);

  const getClientTypeMaster = async () => {
    try {
      const response = await clientTypeService.getClientTypeMasterData();
      if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        closeFormPopup();
        setClientTypeMaster(response.records);
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
  };

  const openSaveForm = async () => {
    setRowData(null);
    setFormPopup(true);
  };

  const clientTypeHandler = async (form: FormType) => {
    const updatedForm = { ...form };
    setFormObjState(updatedForm);
  };

  const onUpdate = async (data: any) => {
    setRowData(data);
    updateClientTypeMaster(data);
    setFormPopup(true);
  };

  const updateClientTypeMaster = (data: any) => {
    formObjState.clientType.value = data.client_type;
  };
  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const createNewRecord = async (event: FormEvent) => {
    event.preventDefault();
    const obj: any = {
      clientType: formObjState?.clientType?.value,
      isActive: 1,
      updatedBy: loggedInUserId,
    };
    if (rowData && rowData?.id) {
      obj["id"] = rowData.id;
    }
    try {
      const response = await clientTypeService.createClientTypeMasterData(obj);
      if (
        response?.statusCode === HTTP_RESPONSE.CREATED ||
        response?.statusCode === HTTP_RESPONSE.SUCCESS
      ) {
        closeFormPopup();
        getClientTypeMaster();
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
        !(data?.isActive) ? "activate" : "deactivate"
      } this record?`,
      acceptFunction: () => confirmDelete(data),
      rejectFunction: onPopUpClose,
    });
    setShowConfirmDialogue(true);
  };

  const confirmDelete = (data: any) => {
    setLoader(true);
    clientTypeService
      .activateDeactivateClientTypeMaster({
        id: data.id,
        isActive: data.isActive === 0 ? 1 : 0,
        loggedInUserId: loggedInUserId,
      })
      .then(() => {
        setLoader(false);
        getClientTypeMaster();
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Client Type ${data?.isActive ? "deactivated" : "activated"} successfully`,
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
          label="Add New Client Type"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={clientTypeMaster}
          column={clientTypeColumns}
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
                <h4 className="popup-heading">{rowData?'Update':`Add New`} Client Type</h4>
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
                formUpdateEvent={clientTypeHandler}
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

export default ClientTypeMaster;
