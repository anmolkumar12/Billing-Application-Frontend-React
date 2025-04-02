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
import moment from "moment";

const TechMaster = () => {
  const TechFormFields = {
    techName: {
      inputType: "inputtext",
      label: "Technology Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    group_name: {
      inputType: "singleSelect",
      label: "Technology Group",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    subGroup_name: {
      inputType: "multiSelect",
      label: "Technology SubGroup",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
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
  const [techMaster, setTechMaster] = useState<any>([]);
  const [techSubGroupMaster, setTechSubGroupMaster] = useState<any>([]);
  const [techGroupMaster, setTechGroupMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditTechnology, setIsEditTechnology] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [techFieldsStructure, setTechFieldsStructure] = useState<any>(
    _.cloneDeep(TechFormFields)
  );
  const [TechForm, setTechForm] = useState<any>(
    _.cloneDeep(techFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const technologyService = new TechnologyMasterService();

  const TechMasterColumns = [
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
      label: "Technology",
      fieldName: "techName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "techName",
      changeFilter: true,
      placeholder: "Technology Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.techName}
          >
            {rowData.techName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Technology Sub-Group",
      fieldName: "techSubgroupNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "techSubgroupNames",
      changeFilter: true,
      placeholder: "Technology SubGroup Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.techSubgroupNames}
          >
            {rowData.techSubgroupNames}
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
      await getTechMaster();
      const techGroups = await getTechGroupMaster();
      await formatGroupDetails(techGroups);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getTechMaster = async () => {
    setLoader(true);
    try {
      const response = await technologyService.getTechnologyMaster();
      response?.subgroups?.forEach((el: any) => {
        el.updated_at = el.updated_at ?  moment(el.updated_at).format("DD-MM-YYYY HH:mm:ss") : null;
        });
      setTechMaster(response?.subgroups);
      return response?.subgroups;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getTechSubGroupMaster = async (techGroupId: any) => {
    // setLoader(true);
    try {
      const response = await technologyService.getTechnologySubGroupMaster(
        techGroupId
      );
      setTechSubGroupMaster(response?.subgroups);
      await formatSubGroupDetails(response?.subgroups, techGroupId);
      return response?.subgroups;
    } catch (error) {
      console.error(error);
    } finally {
      //   setLoader(false);
    }
  };

  const getTechGroupMaster = async () => {
    setLoader(true);
    try {
      const response = await technologyService.getTechnologyGroupMaster();
      const temp = response?.groups?.filter((item: any) => item?.isactive || item?.isActive)
      setTechGroupMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatSubGroupDetails = async (
    techSubGroups: any = techSubGroupMaster,
    techGroupId: any
  ) => {
    const subGrouplist = techSubGroups
      ?.filter((item: any) => item?.techGroupIds == techGroupId)
      ?.map((subGroup: any) => subGroup?.name);
    techFieldsStructure.subGroup_name.options = subGrouplist;
    setTechFieldsStructure(techFieldsStructure);
  };

  const formatGroupDetails = async (techGroups: any = techGroupMaster) => {
    const grouplist = techGroups.map((group: any) => group?.name);
    techFieldsStructure.group_name.options = grouplist;
    setTechFieldsStructure(techFieldsStructure);
    await techFormHandler(techFieldsStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const modifyFormTechGroup = async (selectGroup: any) => {
    const groups = techGroupMaster?.find(
      (group: any) => group?.name === selectGroup
    );
    if (groups) {
      const subGroups = await getTechSubGroupMaster(groups?.id);
      const subGroupList = subGroups
        ?.filter((item: any) => item?.techGroupIds == groups?.id)
        .map((subGroup: any) => subGroup?.name);
      return subGroupList;
    }
    return [];
  };

  const techFormHandler = async (form: FormType) => {
    const updatedForm = { ...form }
    const techGroupAreUnequal =
      updatedForm?.group_name?.value !== TechForm?.group_name?.value;

    // if (techGroupAreUnequal) {
    const subGroupList = await modifyFormTechGroup(updatedForm?.group_name?.value);
    if (subGroupList) {
      updatedForm.subGroup_name.options = subGroupList;
      // updatedForm.subGroup_name.value = null;
    }
    // }
    // setTechForm(updatedForm);
    // Only update the state if the form has truly changed
    if (!_.isEqual(form, TechForm)) {
      setTechForm({ ...form });
    }
  };

  const onUpdate = async (data: any) => {
    setStateData(data);
    const subGroupList = await modifyFormTechGroup(data?.techGroupNames);
    updateTechMaster(data, subGroupList);
    setFormPopup(true);
    setIsEditTechnology(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateTechMaster = (data: any, subGroupList: any) => {
    try {
      console.log("here data", data);
      console.log("here subGroupList", subGroupList);

      techFieldsStructure.techName.value = data?.techName;
      techFieldsStructure.group_name.value = data?.techGroupNames;
      techFieldsStructure.subGroup_name.options = subGroupList;
      techFieldsStructure.subGroup_name.value = data?.techSubgroupNames?.split(',');
      techFieldsStructure.description.value =
        data?.description != null && data?.description != "null"
          ? data?.description
          : "";
      setTechForm(_.cloneDeep(techFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewTech = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(TechForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const techGroup = techGroupMaster?.find(
        (group: any) => group?.name == TechForm?.group_name?.value
      );
      const techSubGroup = techSubGroupMaster?.find(
        (subGroup: any) => subGroup?.name == TechForm?.subGroup_name?.value
      );

      let techSubGroupId = "";
      TechForm?.subGroup_name?.value?.forEach((item: any) => {
        const id =
        techSubGroupMaster?.find((tech: any) => tech?.name == item)?.id ??
          null;
        if (id != null) {
          techSubGroupId = techSubGroupId != "" ? techSubGroupId + "," + id : id;
        }
      });

      const obj = {
        techName: TechForm?.techName?.value,
        techGroupIds: techGroup?.id || null,
        techSubgroupIds: techSubGroupId || null,
        description: TechForm?.description?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        technologyService
          .createTechnologyMaster(obj)
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
        const updatePayload = { ...obj, id: stateData?.id };
        technologyService
          .updateTechnologyMaster(updatePayload)
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
      message: `Are you sure you want to ${!(data?.isactive || data?.is_active || data?.isActive)
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
      .deactivateTechnologyMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Technology record ${patchData?.isActive ? "deactivated" : "activated"
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
    setIsEditTechnology(false);
    setStateData({});
    setTechFieldsStructure(_.cloneDeep(TechFormFields));
    setTechForm(_.cloneDeep(TechFormFields));
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
          label="Add New Technology"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={techMaster}
          column={TechMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Technology"}
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
                <h4 className="popup-heading">{isEditTechnology ? 'Update' : 'Add New'} Technology</h4>
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
                form={techFieldsStructure}
                formUpdateEvent={techFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewTech}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TechMaster;
