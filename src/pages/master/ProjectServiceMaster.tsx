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

import ProjectServiceMasterService from "../../services/masters/project-service-master/projectServiceMaster.service";
import moment from "moment";

const ProjectServiceMaster = () => {
  const formObj = {
    name: {
      inputType: "inputtext",
      label: "Name",
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
    }
  };

  const [projectServiceMaster, setProjectServiceMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [rowData, setRowData] = useState<any>({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [formObjState, setFormObjState] = useState<any>(
    _.cloneDeep(formObj)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  const projectService = new ProjectServiceMasterService();

  const projectServiceColumns = [
    {
      label: "Action",
      fieldName: "action",
      textAlign: "left",
      // frozen: true,
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
      label: "Name",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span id={`nameTooltip-${rowData.id}`}>
            {rowData.name}
          </span>
          <Tooltip target={`#nameTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "description",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "description",
      changeFilter: true,
      placeholder: "Description",
      body: (rowData: any) => (
        <div>
          <span id={`descriptionTooltip-${rowData.id}`}>
            {rowData.description}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
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
    getProjectServiceMaster();
  }, []);

  const getProjectServiceMaster = async () => {
    try {
      const response = await projectService.getProjectServiceMasterData();
      if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        closeFormPopup();
        response?.records?.forEach((el: any) => {
          el.updated_at = el.updated_at ?  moment(el.updated_at).format("DD-MM-YYYY HH:mm:ss") : null;
          });
        setProjectServiceMaster(response.records);
      }
    } catch (error: any) {
      ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
    }
  };

  const openSaveForm = async () => {
    setRowData(null);
    setFormPopup(true);
  };

  const projectServiceHandler = async (form: FormType) => {
    const updatedForm = { ...form };
    setFormObjState(updatedForm);
  };

  const onUpdate = async (data: any) => {
    setRowData(data);
    updateProjectServiceMaster(data);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateProjectServiceMaster = (data: any) => {
    formObjState.name.value = data.name;
    formObjState.description.value = data.description;
  };

  const createNewRecord = async (event: FormEvent) => {
    event.preventDefault();
    const obj: any = {
      name: formObjState?.name?.value,
      description: formObjState?.description.value,
      isActive: 1,
      updatedBy: loggedInUserId,
    };
    if (rowData && rowData?.id) {
      obj['id'] = rowData.id;
    }
    try {
      const response = await projectService.createProjectServiceMasterData(obj);
      if (response?.statusCode === HTTP_RESPONSE.CREATED || response?.statusCode === HTTP_RESPONSE.SUCCESS) {
        closeFormPopup();
        getProjectServiceMaster();
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
    projectService
      .activateDeactivateProjectServiceMaster({ id: data.id, isActive: data.isActive == 0 ? 1 : 0, loggedInUserId: loggedInUserId })
      .then(() => {
        setLoader(false);
        getProjectServiceMaster();
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Project service record ${data?.isActive ? "deactivated" : "activated"} successfully`,
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
          label="Add New Project/Service Master"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={projectServiceMaster}
          column={projectServiceColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Project/Service_Master"}
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
                <h4 className="popup-heading">{rowData?'Update':`Add New`} Project/Service Master</h4>
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
                formUpdateEvent={projectServiceHandler}
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

export default ProjectServiceMaster;
