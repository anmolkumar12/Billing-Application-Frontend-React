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

const TechMaster = () => {
  const OemFormFields = {
    oemName: {
      inputType: "inputtext",
      label: "OEM Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    productName: {
      inputType: "inputtext",
      label: "Product Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    // group_name: {
    //   inputType: "singleSelect",
    //   label: "Technology Group",
    //   options: [],
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   fieldWidth: "col-md-4",
    // },
    // subGroup_name: {
    //   inputType: "singleSelect",
    //   label: "Technology SubGroup",
    //   options: [],
    //   value: null,
    //   validation: {
    //     required: true,
    //   },
    //   fieldWidth: "col-md-4",
    // },
    // description: {
    //   inputType: "inputtextarea",
    //   label: "Description",
    //   value: null,
    //   validation: {
    //     required: false,
    //   },
    //   fieldWidth: "col-md-12",
    //   rows: 3,
    // },
  };
  const [techMaster, setTechMaster] = useState<any>([]);
  const [techSubGroupMaster, setTechSubGroupMaster] = useState<any>([]);
  const [techGroupMaster, setTechGroupMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [techFieldsStructure, setTechFieldsStructure] = useState<any>(
    _.cloneDeep(OemFormFields)
  );
  const [TechForm, setTechForm] = useState<any>(
    _.cloneDeep(techFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const technologyService = new TechnologyMasterService();

  const oemMasterColumns = [
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
      label: "Oem Name",
      fieldName: "oemName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "oemName",
      changeFilter: true,
      placeholder: "OEM Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.techName}
          >
            {rowData.oemName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Product Names",
      fieldName: "productName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "productName",
      changeFilter: true,
      placeholder: "Product Names",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.productName}
          >
            {rowData.productName}
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
      await getTechMaster();
      const techGroups = await getTechGroupMaster();
      await formatGroupDetails(techGroups);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getTechMaster = async () => {
   
  };

  const getTechSubGroupMaster = async (techGroupId: any) => {
    // setLoader(true);
 
  };

  const getTechGroupMaster = async () => {
   
  };

  const formatSubGroupDetails = async (
    techSubGroups: any = techSubGroupMaster,
    techGroupId: any
  ) => {
    
  };

  const formatGroupDetails = async (techGroups: any = techGroupMaster) => {
  
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const modifyFormTechGroup = async (selectGroup: any) => {
   
  };

  const techFormHandler = async (form: FormType) => {
    
  };

  const onUpdate = async (data: any) => {
    setStateData(data);
    const subGroupList = await modifyFormTechGroup(data?.techGroupNames);
    updateTechMaster(data, subGroupList);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateTechMaster = (data: any, subGroupList: any) => {
    
  };

  const createNewTech = (event: FormEvent) => {
    event.preventDefault();
    
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
      .deactivateTechnologyMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Technology record ${
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
    setTechFieldsStructure(_.cloneDeep(OemFormFields));
    setTechForm(_.cloneDeep(OemFormFields));
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
          label="Add New OEM"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={techMaster}
          column={oemMasterColumns}
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
                <h4 className="popup-heading">Add New OEM</h4>
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
