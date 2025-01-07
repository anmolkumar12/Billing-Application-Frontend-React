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
import OemMasterService from "../../services/masters/oem-master/oemMaster.service";

const OemMaster = () => {
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
    type: {
      inputType: "singleSelect",
      label: "Type",
      options: ['License','AMC'],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
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
  const [OemMaster, setOemMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [rowData,setRowData] = useState<any>(null);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [oemFieldsStructure, setOemFieldStructure] = useState<any>(
    _.cloneDeep(OemFormFields)
  );
  const [oemForm, setOemForm] = useState<any>(
    _.cloneDeep(oemFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  
  const oemMasterService = new OemMasterService();

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
   getOemMaster();
  }, []);

  const getOemMaster = async () => {
   try {
    const response = await oemMasterService.getOemMasterData();
    if (response?.statusCode === HTTP_RESPONSE.SUCCESS) {
      setOemMaster(response.oems);
     }
   } catch (error:any) {
    ToasterService.show(error || "Something Went Wrong", CONSTANTS.ERROR);
   }
  };


  const openSaveForm = async () => {
    setFormPopup(true);
    setRowData(null);
  };



  const oemFormHandler = async (form: FormType) => {
    const updatedForm = {...form}
    setOemForm(updatedForm);
  };

  const onUpdate = async (data: any) => {
      setRowData(data);
      oemFieldsStructure.oemName.value = data?.oemName;
      oemFieldsStructure.productName.value = data?.productName;
      oemFieldsStructure.type.value = data.type || "";
      setOemForm(_.cloneDeep(oemFieldsStructure));
      setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };



  const createNewOem = async (event: FormEvent) => {
    event.preventDefault();
    const obj:any = {
      oemName: oemForm?.oemName?.value,
      productName: oemForm?.productName?.value,
      type:oemForm?.type.value,
      isActive: 1,
      updatedBy: loggedInUserId,  
    };
    if( rowData && rowData?.id){
      obj['id'] = rowData.id
    }
    try {
      const response = await oemMasterService.createOemMasterData(obj);
       if (response?.statusCode === HTTP_RESPONSE.CREATED ||response?.statusCode === HTTP_RESPONSE.SUCCESS ) {
                    closeFormPopup();
                    getOemMaster();
                    ToasterService.show(response?.message, CONSTANTS.SUCCESS);
           }
               
    } catch (error:any) {
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

  const confirmDelete = (rowData:any) => {
    setLoader(true);
    oemMasterService
      .activateDeactivateOemMaster({ id:rowData.id,isActive:rowData.isActive == 0?1:0 ,loggedInUserId:loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        getOemMaster();
        ToasterService.show(
          `Oem record ${
            rowData?.isActive ? "deactivated" : "activated"
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
    setRowData(null);
    setOemFieldStructure(_.cloneDeep(OemFormFields));
    setOemForm(_.cloneDeep(OemFormFields));
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
          data={OemMaster}
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
                <h4 className="popup-heading">{rowData?`Update`:`Add New`} OEM</h4>
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
                form={oemFieldsStructure}
                formUpdateEvent={oemFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewOem}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OemMaster;
