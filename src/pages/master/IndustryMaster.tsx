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
import { IndustryMasterService } from "../../services/masters/industry-master/industry.service";
import moment from "moment";

const IndustryMaster = () => {
  const IndustryFormFields = {
    industryName: {
      inputType: "inputtext",
      label: "Sub-Industry Name",
      value: null,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
    subIndustryCategory : {
      inputType: "inputtext",
      label: "Sub-Industry Category",
      value: null,
      options: [],
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };
  const [productionTypeMaster, setProductionTypeMaster] = useState<any>([]);
  const [industryMaster, setIndustryMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [industryFieldsStructure, setIndustryFieldsStructure] = useState<any>(
    _.cloneDeep(IndustryFormFields)
  );
  const [IndustryForm, setIndustryForm] = useState<any>(
    _.cloneDeep(industryFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const industryService = new IndustryMasterService();

  const IndustryMasterColumns = [
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
      label: "Sub-Industry",
      fieldName: "Sub-Industry",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryName",
      changeFilter: true,
      placeholder: "Industry",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.industryName}
          >
            {rowData.industryName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Sub Industry Categories",
      fieldName: "subIndustryCategory ",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "subIndustryCategory ",
      changeFilter: true,
      placeholder: "Industry",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.subIndustryCategory }
          >
            {rowData.subIndustryCategory }
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
      await getIndustryMaster();
      const productionTypes = await getProductionTypeMaster();
      await formatProductionTypeDetails(productionTypes);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getIndustryMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryMaster();
      response.industryMasters?.forEach((el: any) => {
       el.updated_at = el?.updated_at ? moment(el?.updated_at).format("DD-MM-YYYY HH:mm:ss") : null
      })
      setIndustryMaster(response?.industryMasters);
      return response?.industryMasters;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getProductionTypeMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getProductionTypeMaster();
      setProductionTypeMaster(response?.productionTypes);
      return response?.productionTypes;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatProductionTypeDetails = async (
    productionTypes: any = productionTypeMaster
  ) => {
    // const typesList = productionTypes.map(
    //   (types: any) => types?.productionTypeName
    // );
    // industryFieldsStructure.productionType.options = typesList;
    await setIndustryFieldsStructure(industryFieldsStructure);
    await industryFormHandler(industryFieldsStructure);
  };

  const openSaveForm = async () => {
    setEditing(false);
    setFormPopup(true);
  };

  const industryFormHandler = async (form: FormType) => {
    setIndustryForm(form);
  };

  const onUpdate = (data: any) => {
    console.log('here i ma')
    setEditing(true);
    setStateData(data);
    updateIndustryMaster(data);
    setFormPopup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateIndustryMaster = (data: any) => {
    try {
      industryFieldsStructure.industryName.value = data?.industryName;
      industryFieldsStructure.subIndustryCategory.value = data?.subIndustryCategory;
      setIndustryForm(_.cloneDeep(industryFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewIndustry = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(IndustryForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.value;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      // let productionTypeIds = "";
      // IndustryForm?.productionType?.value?.forEach((item: any) => {
      //   const id =
      //     productionTypeMaster?.find((types: any) => types?.productionTypeName == item)?.id ??
      //     null;
      //   if (id != null) {
      //     productionTypeIds = productionTypeIds != "" ? productionTypeIds + "," + id : id;
      //   }
      // });
      const obj = {
        industryName: IndustryForm?.industryName?.value,
        subIndustryCategory: IndustryForm?.subIndustryCategory?.value,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        industryService
          .createIndustryMaster(obj)
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
        const updatePayload = { ...obj, industryMasterId: stateData?.id };
        industryService
          .updateIndustryMaster(updatePayload)
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
    industryService
      .deactivateIndustryMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Industry record ${
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
    setIndustryFieldsStructure(_.cloneDeep(IndustryFormFields));
    setIndustryForm(_.cloneDeep(IndustryFormFields));
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
          label="Add New Sub-Industry"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={industryMaster}
          column={IndustryMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Sub-Industry"}
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
                <h4 className="popup-heading">{!editing ? `Add New`:`Update`} Sub-Industry</h4>
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
                form={_.cloneDeep(IndustryForm)}
                formUpdateEvent={industryFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewIndustry}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default IndustryMaster;
