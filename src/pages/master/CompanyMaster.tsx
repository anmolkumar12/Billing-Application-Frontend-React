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
import { CompanyMasterService } from "../../services/masters/company-master/company.service";
import { FILE_TYPES } from "../../enums/file-types.enum";
import { Chip } from "primereact/chip";
import { ImageUrl } from "../../utils/ImageUrl";
import { CountryMasterService } from "../../services/masters/country-master/country.service";

const CompanyMaster = () => {
  const CompanyFormFields: FormType = {
    companyName: {
      inputType: "inputtext",
      label: "Company Name",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    country_name: {
      inputType: "singleSelect",
      label: "Country",
      options: [],
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    Website: {
      inputType: "inputtext",
      label: "Website",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
    Email: {
      inputType: "inputtext",
      label: "Email",
      value: null,
      validation: {
        required: true,
      },
      fieldWidth: "col-md-4",
    },
  };

  const ParentFormFields: FormType = {
    independent: {
      inputType: "inputSwitch",
      label: "Is It Independent Company?",
      value: false,
      validation: {
        required: false,
      },
      fieldWidth: "col-md-4",
    },
    parent_comp: {
      inputType: "singleSelect",
      label: "Parent Company",
      disable: false,
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
  const [companyMaster, setCompanyMaster] = useState<any>([]);
  const [countryMaster, setCountryMaster] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [storeFormPopup, setFormPopup] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [showConfirmDialogue, setShowConfirmDialogue] = useState(false);
  const [actionPopupToggle, setActionPopupToggle] = useState<any>([]);
  const [attachments, setAttachments]: any = useState([]);
  const [digitalSign, setDigitalSign]: any = useState([]);
  const [logoUrl,setLogoUrl] = useState('');
  const [signatureUrl,setSignatureUrl] = useState('');
  const [stateData, setStateData] = useState<any>();
  const [companyFieldStructure, setCompanyFieldStructure] = useState<any>(
    _.cloneDeep(CompanyFormFields)
  );
  const [CompanyForm, setCompanyForm] = useState<any>(
    _.cloneDeep(companyFieldStructure)
  );
  const [AdditionalDetailsForm, setAdditionalDetailsForm] = useState<any>({});
  const [parentFieldStructure, setParentFieldStructure] = useState<any>(
    _.cloneDeep(ParentFormFields)
  );
  const [ParentForm, setParentForm] = useState<any>(
    _.cloneDeep(parentFieldStructure)
  );

  const cookies = new Cookies();
  const userInfo = cookies.get("userInfo");

  const loggedInUserId = userInfo?.userId;
  let patchData: any;

  const countryService = new CountryMasterService();
  const companyService = new CompanyMasterService();

  const CompanyMasterColumns = [
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
            className={`pi pi-${rowData.isactive ? "ban" : "check-circle"}`}
            style={{ cursor: "pointer" }}
            title={rowData.isactive ? "Deactivate" : "Activate"}
            onClick={() => onDelete(rowData)}
          ></span>
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
      label: "Country",
      fieldName: "countryName",
      textAlign: "left",
      sort: true,
      filter: true,
      fieldValue: "countryName",
      changeFilter: true,
      placeholder: "Country",
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.countryName}
          >
            {rowData.countryName}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Website",
      fieldName: "Website",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.Website}
          >
            {rowData.Website}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Email",
      fieldName: "Email",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.Email}
          >
            {rowData.Email}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Independent",
      fieldName: "independent",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.IECode}
          >
            {rowData.independent == 1 ? "Yes" : "No"}
          </span>
          <Tooltip
            target={`#companyNameTooltip-${rowData.id}`}
            position="top"
          />
        </div>
      ),
    },
    {
      label: "Parent Company",
      fieldName: "parentCompanyName",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.IECode}
          >
            {rowData.parentCompanyName != null
              ? rowData.parentCompanyName
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
      label: "Additional Details",
      fieldName: "companyAddtionalFields",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span
            id={`companyNameTooltip-${rowData.id}`}
            // data-pr-tooltip={rowData.companyAddtionalFields}
          >
            {rowData.companyAddtionalFields != null &&
            rowData.companyAddtionalFields != "null" &&
            rowData.companyAddtionalFields != ""
              ? rowData.companyAddtionalFields
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
      fieldName: "isactive",
      textAlign: "left",
      frozen: false,
      sort: true,
      filter: true,
      body: (rowData: any) => (
        <div>
          <span style={{ color: rowData?.isactive == 1 ? "green" : "red" }}>
            {rowData?.isactive == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const companies = await getCompanyMaster();
      const countries = await getCountryMaster();
      await formatCompanyDetails(companies);
      await formatCountryDetails(countries);
    };
    if (storeFormPopup == false && showConfirmDialogue == false) {
      fetchData();
    }
  }, [storeFormPopup, showConfirmDialogue]);

  const getCompanyMaster = async () => {
    setLoader(true);
    try {
      const response = await companyService.getCompanyMaster();
      setCompanyMaster(response?.companies);
      return response?.companies;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getCountryMaster = async () => {
    setLoader(true);
    try {
      const response = await countryService.getCountryMaster();
      setCountryMaster(response?.countries);
      return response?.countries;
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const formatCompanyDetails = async (companies: any = companyMaster) => {
    const companyList = companies.map((company: any) => company?.companyName);
    parentFieldStructure.parent_comp.options = companyList;
    setParentFieldStructure(parentFieldStructure);
  };

  const formatCountryDetails = async (countries: any = countryMaster) => {
    const countrylist = countries.map((country: any) => country?.name);
    companyFieldStructure.country_name.options = countrylist;
    setCompanyFieldStructure(companyFieldStructure);
    await companyFormHandler(companyFieldStructure);
  };

  const openSaveForm = async () => {
    setFormPopup(true);
  };

  const companyFormHandler = async (form: FormType) => {
    if (form?.country_name?.value != CompanyForm?.country_name?.value) {
      const selectedCountry = countryMaster?.find(
        (item: any) => item?.name == form?.country_name?.value
      );
      if (selectedCountry) {
        const companyDetails = JSON.parse(
          selectedCountry?.companyAddtionalFields
        );
        const detailsForm = Object.keys(companyDetails)?.reduce(
          (acc: any, item: any, index: any) => {
            acc[index] = {
              inputType: "inputtext",
              label: companyDetails[item],
              value: null,
              validation: {
                required: false,
              },
              fieldWidth: "col-md-4",
            };
            return acc;
          },
          {}
        );
        setAdditionalDetailsForm(detailsForm);
      }
    }
    setCompanyForm(form);
  };

  const additionalDetailsFormHandler = async (form: FormType) => {
    setAdditionalDetailsForm(form);
  };

  const parentFormHandler = async (form: FormType) => {
    if (form?.independent?.value == false || !form?.independent?.value) {
      const companyNamesList = companyMaster
        ?.filter(
          (company: any) => company?.companyName != form?.companyName?.value
        )
        ?.map((company: any) => company?.companyName);
      form.parent_comp.options = companyNamesList;
      form.parent_comp.disable = false;
      if (form.parent_comp.validation) {
        form.parent_comp.validation.required = true;
      }
    } else {
      form.parent_comp.value = null;
      form.parent_comp.disable = true;
      if (form.parent_comp.validation) {
        form.parent_comp.validation.required = false;
      }
    }
    setParentForm(form);
  };

  const selectAttachment = (files: any) => {
    setAttachments([]);
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          eventList.name
            .split(".")
            [eventList.name.split(".").length - 1].toLowerCase() ===
          FILE_TYPES.PNG
        ) {
          if (eventList.size > 10485760) {
            return ToasterService.show(
              "file size is too large, allowed maximum size is 10 MB.",
              "error"
            );
          } else {
            setAttachments((prevVals: any) => [...prevVals, eventList]);
            const fileURL = URL.createObjectURL(eventList);
            setLogoUrl(fileURL)
          }
        } else {
          ToasterService.show(
            `Invalid file format you can only attach the pdf here!`,
            "error"
          );
          eventList = null;
        }
      });
    }
  };

  const selectDigitalSign = (files: any) => {
    setDigitalSign([]);
    if (files && files[0]) {
      _.each(files, (eventList) => {
        if (
          eventList.name
            .split(".")
            [eventList.name.split(".").length - 1].toLowerCase() ===
          FILE_TYPES.PNG
        ) {
          if (eventList.size > 10485760) {
            return ToasterService.show(
              "file size is too large, allowed maximum size is 10 MB.",
              "error"
            );
          } else {
            setDigitalSign((prevVals: any) => [...prevVals, eventList]);
            const fileURL = URL.createObjectURL(eventList);
            setSignatureUrl(fileURL);
          }
        } else {
          ToasterService.show(
            `Invalid file format you can only attach the pdf here!`,
            "error"
          );
          eventList = null;
        }
      });
    }
  };

  const removeFileHandler = () => {
    setAttachments([]);
    setLogoUrl('');
  };

  const removeSignHandler = () => {
    setDigitalSign([]);
    setSignatureUrl('');
  };

  const onUpdate = (data: any) => {
    setStateData(data);
    updateCompanyMaster(data);
    setLogoUrl(data?.logopath?`${process.env.REACT_APP_API_BASEURL}/${data?.logopath}`:'');
    setSignatureUrl(data?.digitalSignPath?`${process.env.REACT_APP_API_BASEURL}/${data?.digitalSignPath}`:'');
    setFormPopup(true);
  };
    
  const onPopUpClose = (e?: any) => {
    setShowConfirmDialogue(false);
  };
  const updateCompanyMaster = (data: any) => {
    try {
      const companyNamesList = companyMaster
        ?.filter((company: any) => company?.companyName != data?.companyName)
        ?.map((company: any) => company?.companyName);
      companyFieldStructure.companyName.value = data?.companyName;
      companyFieldStructure.country_name.value = data?.countryName;
      companyFieldStructure.Email.value = data?.Email;
      companyFieldStructure.Website.value = data?.Website;
      setCompanyForm(_.cloneDeep(companyFieldStructure));
      if (data?.companyAddtionalFields) {
        const companyDetails = JSON.parse(data?.companyAddtionalFields);
        const companyForm = Object.keys(companyDetails)?.reduce(
          (acc: any, item: any, index: any) => {
            acc[index] = {
              inputType: "inputtext",
              label: item,
              value: companyDetails[item],
              validation: {
                required: false,
              },
              fieldWidth: "col-md-4",
            };
            return acc;
          },
          {}
        );
        setAdditionalDetailsForm(companyForm);
      }
      parentFieldStructure.description.value =
        data?.description != null && data?.description != "null"
          ? data?.description
          : "";
      if (data?.independent == 1) {
        console.log("here data", data);

        parentFieldStructure.independent.value = true;
        parentFieldStructure.parent_comp.value = null;
        parentFieldStructure.parent_comp.disable = true;
        if (parentFieldStructure.parent_comp.validation) {
          parentFieldStructure.parent_comp.validation.required = false;
        }
      } else {
        parentFieldStructure.independent.value = false;
        parentFieldStructure.parent_comp.value = data?.parentCompanyName;
        parentFieldStructure.parent_comp.options = companyNamesList;
        parentFieldStructure.parent_comp.disable = false;
        if (parentFieldStructure.parent_comp.validation) {
          parentFieldStructure.parent_comp.validation.required = true;
        }
      }
      setParentForm(_.cloneDeep(parentFieldStructure));
    } catch (error) {
      console.log("error", error);
    }
  };

  const createNewCompany = (event: FormEvent) => {
    event.preventDefault();
    let companyValidityFlag = true;

    _.each(CompanyForm, (item: any) => {
      if (item?.validation?.required) {
        companyValidityFlag = companyValidityFlag && item.valid;
      }
      if (
        CompanyForm?.independent?.value == false &&
        CompanyForm?.parent_comp?.value == null
      ) {
        companyValidityFlag = false;
      }
    });
    setIsFormValid(companyValidityFlag);

    if (companyValidityFlag) {
      const formData: any = new FormData();
      const parentCompanyId =
        companyMaster?.find(
          (item: any) => item?.companyName == ParentForm?.parent_comp.value
        )?.id ?? null;

      const countryId =
        countryMaster.find(
          (country: any) => country.name === CompanyForm.country_name.value
        )?.id ?? null;

      const companyData = Object.keys(AdditionalDetailsForm)?.reduce(
        (acc: any, item: any, index: any) => {
          if (AdditionalDetailsForm[index]?.value != null) {
            acc[AdditionalDetailsForm[index]?.label] =
              AdditionalDetailsForm[index]?.value;
          }
          return acc;
        },
        {}
      );
      const obj = {
        companyName: CompanyForm?.companyName?.value,
        countryId: countryId,
        Email: CompanyForm?.Email?.value,
        Website: CompanyForm?.Website?.value,
        independent: ParentForm?.independent?.value == true ? 1 : 0,
        parentCompanyId: parentCompanyId ? parentCompanyId : 0,
        description: ParentForm?.description?.value,
        companyAddtionalFields: JSON?.stringify(companyData) || null,
        isActive: 1,
        updatedBy: loggedInUserId,
      };
      Object.entries(obj).forEach(([key, value]: any) => {
        formData.set(key, value);
      });

      if (attachments?.length) {
        formData.set("logo", attachments[0]);
      }

      if (digitalSign?.length) {
        formData.set("digitalSign", digitalSign[0]);
      }
      console.log("here formData", formData);

      if (!stateData?.id) {
        companyService
          .createCompanyMaster(formData)
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
        const formData: any = new FormData();
        const updatePayload = { ...obj, companyId: stateData?.id };

        Object.entries(updatePayload).forEach(([key, value]: any) => {
          formData.set(key, value);
        });

        if (attachments?.length) {
          formData.set("logo", attachments[0]);
        }

        if (digitalSign?.length) {
          formData.set("digitalSign", digitalSign[0]);
        }

        companyService
          .updateCompanyMaster(formData)
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
    companyService
      .deactivateCompanyMaster({ ...patchData, loggedInUserId })
      .then(() => {
        setLoader(false);
        setShowConfirmDialogue(false);
        ToasterService.show(
          `Company record ${
            patchData?.isactive ? "deactivated" : "activated"
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
    setCompanyFieldStructure(_.cloneDeep(CompanyFormFields));
    setCompanyForm(_.cloneDeep(CompanyFormFields));
    setParentFieldStructure(_.cloneDeep(ParentFormFields));
    setParentForm(_.cloneDeep(ParentFormFields));
    setAdditionalDetailsForm({});
    setAttachments([]);
    setDigitalSign([]);
  
   
  };
  console.log('signas',signatureUrl);
  
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
          label="Add New Company"
          icon="pi pi-check"
          iconPos="right"
          submitEvent={openSaveForm}
        />
      </div>
      <p className="m-0">
        <DataTableBasicDemo
          data={companyMaster}
          column={CompanyMasterColumns}
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
            loading={false}
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
                <h4 className="popup-heading">Add New Company</h4>
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
                form={_.cloneDeep(CompanyForm)}
                formUpdateEvent={companyFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
              <FormComponent
                form={_.cloneDeep(AdditionalDetailsForm)}
                formUpdateEvent={additionalDetailsFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
              <FormComponent
                form={_.cloneDeep(ParentForm)}
                formUpdateEvent={parentFormHandler}
                isFormValidFlag={isFormValid}
              ></FormComponent>
              {/* attachment */}
              <div className={classes["upload-wrapper"]}>
                <div className="row">
                  <div
                    className={`col-md-12 ${classes["addition-field-header"]}`}
                  >
                    <h5 className="popup-heading">Company Logo</h5>
                  </div>
                  <div className="col-md-12">
                    <div className={classes["upload-file-section"]}>
                      <div className={classes["upload-file"]}>
                        {logoUrl  ? (
                          <div className={classes["image-preview"]}>
                            <div className="icon-ui677"> <i className="pi pi-times-circle" onClick={removeFileHandler} style={{ color: 'red',fontSize: '1rem' }}></i></div>
                            <img src={logoUrl} style={{width:'200px',height:'130px'}}  alt="Preview" />
                            {/* <div className={classes["chip-tm"]}>
                              {attachments.map(
                                (
                                  item: { name: string | undefined },
                                  index: React.Key | null | undefined
                                ) => (
                                  <Chip
                                    label={item.name}
                                    removable
                                    onRemove={() => removeFileHandler()}
                                    key={index}
                                  />
                                )
                              )}
                            </div> */}
                          </div>
                        ) : (
                          <div className={classes["empty-upload"]}>
                            <input
                              type="file"
                              onClick={(event: any) => {
                                event.target.value = null;
                              }}
                              onChange={(e) => selectAttachment(e.target.files)}
                              className={classes["upload"]}
                              style={{ width: "unset" }}
                            />
                            <img
                              src={ImageUrl.FolderIconImage}
                              alt="Folder Icon"
                            />
                            <p>
                              Drag files here <span> or browse</span> <br />
                              <u>Support PNG</u>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes["upload-wrapper"]}>
                <div className="row">
                  <div
                    className={`col-md-12 ${classes["addition-field-header"]}`}
                  >
                    <h5 className="popup-heading">Digital Signature</h5>
                  </div>
                  
                  <div className="col-md-12">
                    <div className={classes["upload-file-section"]}>
                      <div className={classes["upload-file"]}>
                        {signatureUrl ? (
                          <div  className={classes["image-preview"]}>
                          <div className="icon-ui677"> <i className="pi pi-times-circle" onClick={removeSignHandler} style={{ color: 'red',fontSize: '1rem' }}></i></div>
                            <img src={signatureUrl} style={{width:'200px',height:'130px'}}  alt="Preview" />
                            {/* <div className={classes["chip-tm"]}>
                              {digitalSign.map(
                                (
                                  item: { name: string | undefined },
                                  index: React.Key | null | undefined
                                ) => (
                                  <Chip
                                    label={item.name}
                                    removable
                                    onRemove={() => removeSignHandler()}
                                    key={index}
                                  />
                                )
                              )}
                            </div> */}
                          </div>
                        ) : (
                          <div className={classes["empty-upload"]}>
                            <input
                              type="file"
                              onClick={(event: any) => {
                                event.target.value = null;
                              }}
                              onChange={(e) =>
                                selectDigitalSign(e.target.files)
                              }
                              className={classes["upload"]}
                              style={{ width: "unset" }}
                            />
                            <img
                              src={ImageUrl.FolderIconImage}
                              alt="Folder Icon"
                            />
                            <p>
                              Drag files here <span> or browse</span> <br />
                              <u>Support PNG</u>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* attachment */}
            </div>

            <div className="popup-lower-btn">
              <ButtonComponent
                label="Submit"
                icon="pi pi-check"
                iconPos="right"
                submitEvent={createNewCompany}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CompanyMaster;
