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
import { SalesMasterService } from "../../services/masters/sales-master/sales.service";
import moment from "moment";
import { CompanyMasterService } from "../../services/masters/company-master/company.service";

const SalesMaster = () => {
  const SalesFormFields = {
    name: {
      inputType: "inputtext",
      label: "Sales Manager Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    code: {
      inputType: "inputtext",
      label: "Sales Manager Ecode",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    sales_manager_email: {
      inputType: "inputtext",
      label: "Sales Manager Email",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    companyName: {
      inputType: "singleSelect",
      label: "Company",
      disable: false,
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    industryHeadNames: {
      inputType: "multiSelect",
      label: "Industry Head",
      value: null,
      options: [],
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    from_date: {
      inputType: "singleDatePicker",
      label: "From Date",
      value: null,
      validation: {
        required: false,
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
  const [industryHeadMaster, setIndustryHeadMaster] = useState<any>([]);
  const [salesMaster, setSalesMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isEditSalesManager, setIsEditSalesManager] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [stateData, setStateData] = useState<any>();
  const [salesFieldsStructure, setSalesFieldsStructure] = useState<any>(
    _.cloneDeep(SalesFormFields)
  );
  const [SalesForm, setSalesForm] = useState<any>(
    _.cloneDeep(salesFieldsStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;
  const industryService = new IndustryMasterService();
  const salesService = new SalesMasterService();
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const companyService = new CompanyMasterService();


  const SalesMasterColumns = [
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
      label: "Sales Manager Name",
      fieldName: "name",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "name",
      changeFilter: true,
      placeholder: "Sales Manager Name",
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
      label: "Sales Manager Ecode",
      fieldName: "code",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "code",
      changeFilter: true,
      placeholder: "Sales Manager Ecode",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.code}
          >
            {rowData.code}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Sales Manager Email",
      fieldName: "sales_manager_email",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "sales_manager_email",
      changeFilter: true,
      placeholder: "Sales Manager Email",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.code}
          >
            {rowData.sales_manager_email}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Company",
      fieldName: "companyName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "companyName",
      changeFilter: true,
      placeholder: "Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.companyName}
          >
            {rowData.companyName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Industry Head Names",
      fieldName: "industryHeadNames",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "industryHeadNames",
      changeFilter: true,
      placeholder: "Industry Head Name",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.industryHeadNames}
          >
            {rowData.industryHeadNames}
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
      label: "From Date",
      fieldName: "fromDate",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "fromDate",
      changeFilter: true,
      placeholder: "From Date",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
          // data-pr-tooltip={rowData.fromDate}
          >
            {/* {rowData.fromDate} */}
            {moment(rowData.fromDate).format("YYYY-MM-DD")}
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
      label: "Created By",
      fieldName: "updated_by",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "updated_by",
      changeFilter: true,
      placeholder: "Created By",
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
             {moment(rowData.updated_at).format('YYYY-MM-DD HH:mm:ss')}
          </span>
          <Tooltip target={`#descriptionTooltip-${rowData.id}`} position="top" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getSalesMaster();
      const industries = await getIndustryHeadMaster();
      await formatIndustryHeadDetails(industries);
      const companies = await getCompanyMaster();
      await formatCompanyDetails(companies);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getCompanyMaster = async () => {
    setLoader(true);
    try {
      const response = await companyService.getCompanyMaster();
      const temp = response?.companies?.filter((item: any) => item?.isactive || item?.isActive)
      setCompanyMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatCompanyDetails = async (companies: any = companyMaster) => {
    const companyList = companies.map((company: any) => company?.companyName);
    salesFieldsStructure.companyName.options = companyList;
  };

  const getSalesMaster = async () => {
    setLoader(true);
    try {
      const response = await salesService.getSalesMaster();
      setSalesMaster(response?.salesManagers);
      return response?.salesManagers;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getIndustryHeadMaster = async () => {
    setLoader(true);
    try {
      const response = await industryService.getIndustryHeadMaster();
      const temp = response?.industryHeads?.filter((item: any) => item?.isactive || item?.isActive)
      setIndustryHeadMaster(temp);
      return temp;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatIndustryHeadDetails = async (
    industries: any = industryHeadMaster
  ) => {
    const industryHeadList = industries.map(
      (industryHead: any) => industryHead?.industryHeadName
    );
    salesFieldsStructure.industryHeadNames.options = industryHeadList;
    setSalesFieldsStructure(salesFieldsStructure);
    await salesFormHandler(salesFieldsStructure);
  };

  const formatDate = (dateString: any) => {
    const date: any = new Date(dateString);
    if (isNaN(date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const parseDateString = (dateString: any) => {
    if (!dateString) return new Date();
    const date: any = new Date(dateString);
    if (isNaN(date)) return new Date();
    const year = date.getFullYear();
    const month: any = String(date.getMonth() + 1).padStart(2, "0");
    const day: any = String(date.getDate()).padStart(2, "0");
    return new Date(year, month - 1, day);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const salesFormHandler = async (form: FormType) => {
    setSalesForm(form);
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateSalesMaster(data);
    setFormPopup(true);
    setIsEditSalesManager(true);
  };

  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };

  const updateSalesMaster = (data: any) => {
    try {
      salesFieldsStructure.name.value = data?.name;
      salesFieldsStructure.code.value = data?.code;
      salesFieldsStructure.sales_manager_email.value = data?.sales_manager_email;
      salesFieldsStructure.industryHeadNames.value =
        data?.industryHeadNames?.split(",");
      salesFieldsStructure.description.value =
        data?.description != null && data?.description != "null"
          ? data?.description
          : "";
      salesFieldsStructure.from_date.value = parseDateString(data?.fromDate);
      salesFieldsStructure.companyName.value = data?.companyName;

      setSalesForm(_.cloneDeep(salesFieldsStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewSales = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;
    const companyFormValid: boolean[] = [];
    console.log('jjjjjjjjjjjj', SalesForm);

    _.each(SalesForm, (item: any) => {
      if (item?.validation?.required) {
        companyFormValid.push(item.valid);
        companyValidityFlag = companyValidityFlag && item.valid;
      }
    });

    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      let industryHeadIds = "";
      SalesForm?.industryHeadNames?.value?.forEach((item: any) => {
        const id =
          industryHeadMaster?.find(
            (industryHead: any) => industryHead?.industryHeadName == item
          )?.id ?? null;
        if (id != null) {
          industryHeadIds =
            industryHeadIds != "" ? industryHeadIds + "," + id : id;
        }
      });

      const companyId =
        companyMaster.find(
          (company: any) =>
            company.companyName === SalesForm.companyName.value
        )?.id ?? null;


      const obj = {
        name: SalesForm?.name?.value,
        code: SalesForm?.code?.value,
        sales_manager_email: SalesForm.sales_manager_email.value,
        fromDate: formatDate(SalesForm?.from_date?.value),
        description: SalesForm?.description?.value,
        industryHeadIds: industryHeadIds,
        isActive: 1,
        updatedBy: loggedInUserId,
        companyId: companyId,
      };

      if (!stateData?.id) {
        salesService
          .createSalesMaster(obj)
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
        const updatePayload = { ...obj, salesManagerId: stateData?.id };
        salesService
          .updateSalesMaster(updatePayload)
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
    salesService
      .deactivateSalesMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Sales Manager record ${patchData?.isActive ? "deactivated" : "activated"
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
    setIsEditSalesManager(false);
    setStateData({});
    setSalesFieldsStructure(_.cloneDeep(SalesFormFields));
    setSalesForm(_.cloneDeep(SalesFormFields));
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
          label="Add New Sales Manager"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={salesMaster}
          column={SalesMasterColumns}
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
                <h4 className="popup-heading">{isEditSalesManager ? 'Update' : 'Add New'} Sales Manager</h4>
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
                form={_.cloneDeep(SalesForm)}
                formUpdateEvent={salesFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewSales}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SalesMaster;
