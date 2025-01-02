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
import { TechnologyMasterService } from "../../services/masters/technology-master/technology.service";

const TechSubGroupMaster = () => {
  const TechSubGroupFormFields = {
    name: {
      inputType: "inputtext",
      label: "Technology SubGroup Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    group_name: {
      inputType: "singleSelect",
      label: "Technology Group",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    description: {
      inputType: "inputtextarea",
      label: "Description",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-12",
      rows: 3,
    },
  };
  const [techSubGroupMaster, setTechSubGroupMaster] = useState<any>([]);
  const [techGroupMaster, setTechGroupMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [techSubGroupFieldsStructure, setTechSubGroupFieldsStructure] =
    useState<any>(_.cloneDeep(TechSubGroupFormFields));
  const [TechSubGroupForm, setTechSubGroupForm] = useState<any>(
    _.cloneDeep(techSubGroupFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const technologyService = new TechnologyMasterService();

  const TechSubGroupMasterColumns = [
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
      label: "Technology Sub-Group",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Technology SubGroup Name",
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
      label: "Technology Group",
      fieldName: "techGroupNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "techGroupNames",
      changeFilter: true,
      placeholder: "Technology Group",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.techGroupNames}
          >
            {rowData.techGroupNames}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Description",
      fieldName: "description",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.description}
          >
            {rowData.description != null &&
            rowData.description != "null" &&
            rowData.description != ""
              ? rowData.description
              : "NA"}
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
      await getTechSubGroupMaster();
      const techGroups = await getTechGroupMaster();
      await formatGroupDetails(techGroups);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getTechSubGroupMaster = async () => {
    setLoader(true);
    try {
      const response = await technologyService.getTechnologySubGroupMaster();
      setTechSubGroupMaster(response?.subgroups);
      return response?.subgroups;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getTechGroupMaster = async () => {
    setLoader(true);
    try {
      const response = await technologyService.getTechnologyGroupMaster();
      setTechGroupMaster(response?.groups);
      return response?.groups;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatGroupDetails = async (techGroups: any = techGroupMaster) => {
    const grouplist = techGroups.map((group: any) => group?.name);
    techSubGroupFieldsStructure.group_name.options = grouplist;
    setTechSubGroupFieldsStructure(techSubGroupFieldsStructure);
    await techSubGroupFormHandler(techSubGroupFieldsStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const techSubGroupFormHandler = async (form: FormType) => {
    setTechSubGroupForm(form);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateTechSubGroupMaster(data);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateTechSubGroupMaster = (data: any) => {
    try {
      techSubGroupFieldsStructure.name.value = data?.name;
      techSubGroupFieldsStructure.group_name.value =
        data?.techGroupNames;
      techSubGroupFieldsStructure.description.value =
        data?.description != null && data?.description != "null"
          ? data?.description
          : "";
      setTechSubGroupForm(_.cloneDeep(techSubGroupFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewTechSubGroup = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(TechSubGroupForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const techGroup = techGroupMaster?.find((group: any) => group?.name == TechSubGroupForm?.group_name?.value)
      const obj = {
        name: TechSubGroupForm?.name?.value,
        techGroupIds: techGroup?.id || null,
        description: TechSubGroupForm?.description?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        technologyService
          .createTechnologySubGroupMaster(obj)
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
        const updatePayload = { ...obj, subgroupId: stateData?.id };
        technologyService
          .updateTechnologySubGroupMaster(updatePayload)
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
    technologyService
      .deactivateTechnologySubGroupMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Technology SubGroup record ${
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
    setStateData({});
    setTechSubGroupFieldsStructure(_.cloneDeep(TechSubGroupFormFields));
    setTechSubGroupForm(_.cloneDeep(TechSubGroupFormFields));
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
          label="Add New Technology Sub-Group"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={techSubGroupMaster}
          column={TechSubGroupMasterColumns}
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
                <h4 className="popup-heading">Add New Technology SubGroup</h4>
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
                form={_.cloneDeep(TechSubGroupForm)}
                formUpdateEvent={techSubGroupFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewTechSubGroup}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TechSubGroupMaster;
