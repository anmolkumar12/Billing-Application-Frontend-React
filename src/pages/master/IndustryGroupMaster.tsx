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

const IndustryGroupMaster = () => {
  const IndustryGroupFormFields = {
    industryGroupName: {
      inputType: "inputtext",
      label: "Industry Group Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-6",
    },
    industryNames: {
      inputType: "multiSelect",
      label: "Industries",
      value: null,
      options: [],
      validation: {
        required: false,
      },
      fieldWidth: "col-md-6",
    },
  };
  const [industryMaster, setIndustryMaster] = useState<any>([]);
  const [industryGroupMaster, setIndustryGroupMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditIndustryGroup, setIsEditIndustryGroup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industryGroupFieldsStructure, setIndustryGroupFieldsStructure] =
    useState<any>(_.cloneDeep(IndustryGroupFormFields));
  const [IndustryGroupForm, setIndustryGroupForm] = useState<any>(
    _.cloneDeep(industryGroupFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const industryService = new IndustryMasterService();

  const IndustryGroupMasterColumns = [
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
      label: "Industry Group Name",
      fieldName: "groupIndustryName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "groupIndustryName",
      changeFilter: true,
      placeholder: "Industry Group Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.groupIndustryName}
          >
            {rowData.groupIndustryName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Sub Industry",
      fieldName: "industryNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryNames",
      changeFilter: true,
      placeholder: "Industry Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.industryNames}
          >
            {rowData.industryNames}
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
      await getIndustryGroupMaster();
      const industries = await getIndustryMaster();
      await formatIndustryDetails(industries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getIndustryGroupMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryGroupMaster();
      response.groupIndustries?.forEach((el: any) => {
      el.updated_at = el?.updated_at ? moment(el?.updated_at).format("DD-MM-YYYY HH:mm:ss") : null
      })
      setIndustryGroupMaster(response?.groupIndustries);
      return response?.groupIndustries;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getIndustryMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryMaster();
      const temp = response?.industryMasters?.filter((item: any) => item?.isactive || item?.isActive)
      setIndustryMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatIndustryDetails = async (industries: any = industryMaster) => {
    const industryList = industries.map(
      (industry: any) => industry?.industryName
    );
    industryGroupFieldsStructure.industryNames.options = industryList;
    await setIndustryGroupFieldsStructure(industryGroupFieldsStructure);
    await industryGroupFormHandler(industryGroupFieldsStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const industryGroupFormHandler = async (form: FormType) => {
    setIndustryGroupForm(form);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateIndustryGroupMaster(data);
    setFormPopup(true);
    setIsEditIndustryGroup(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateIndustryGroupMaster = (data: any) => {
    try {
      industryGroupFieldsStructure.industryGroupName.value =
        data?.groupIndustryName;
      industryGroupFieldsStructure.industryNames.value = data?.industryNames?.split(",") || [];
      setIndustryGroupForm(_.cloneDeep(industryGroupFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewIndustryGroup = (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true); 
    try{
      let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];

    _.each(IndustryGroupForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.value;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      let industryIds = "";
      IndustryGroupForm?.industryNames?.value?.forEach((item: any) => {
        const id =
          industryMaster?.find((industry: any) => industry?.industryName == item)?.id ??
          null;
        if (id != null) {
          industryIds = industryIds != "" ? industryIds + "," + id : id;
        }
      });

      const obj = {
        groupIndustryName: IndustryGroupForm?.industryGroupName?.value,
        industryIds: industryIds,
        isActive: 1,
        updatedBy: loggedInUserId,
      };

      if (!stateData?.id) {
        industryService
          .createIndustryGroupMaster(obj)
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
        const updatePayload = { ...obj, groupIndustryId: stateData?.id };
        industryService
          .updateIndustryGroupMaster(updatePayload)
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
    }
    finally{
      setIsSubmitting(false); 
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
      .deactivateIndustryGroupMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Industry Group record ${
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
    setIsEditIndustryGroup(false);
    setStateData({});
    setIndustryGroupFieldsStructure(_.cloneDeep(IndustryGroupFormFields));
    setIndustryGroupForm(_.cloneDeep(IndustryGroupFormFields));
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
          label="Add New Industry Group"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={industryGroupMaster}
          column={IndustryGroupMasterColumns}
          showGridlines={true}
          resizableColumns={true}
          rows={20}
          paginator={true}
          sortable={true}
          headerRequired={true}
          scrollHeight={"calc(100vh - 200px)"}
          downloadedfileName={"Industry_Group"}
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
                <h4 className="popup-heading">{isEditIndustryGroup ? 'Update' : 'Add New'} Industry Group</h4>
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
                form={_.cloneDeep(IndustryGroupForm)}
                formUpdateEvent={industryGroupFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                iconPos="right"
                submitEvent={createNewIndustryGroup}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default IndustryGroupMaster;
