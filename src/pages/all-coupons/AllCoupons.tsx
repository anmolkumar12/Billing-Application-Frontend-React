import { Theme, Tooltip, withStyles } from '@material-ui/core'
import { InputText } from 'primereact/inputtext'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import ConfigurationCard from '../../components/ui/cards/configuration-card/ConfigurationCard'
import { HTTP_RESPONSE } from '../../enums/http-responses.enum'
import { InventoryService } from '../../services/inventory-service/inventory.service'
import { MasterService } from '../../services/master-service/master.service'
import { ImageUrl } from '../../utils/ImageUrl'
import './AllCoupons.scss'
import moment from 'moment'
import * as _ from 'lodash'
import DataTableBasicDemo from '../../components/ui/table/Table'
import { ToasterService } from '../../services/toaster-service/toaster-service'
import { CONSTANTS } from '../../constants/Constants'
import { AuthService } from '../../services/auth-service/auth.service'

const AllCoupons: React.FC = () => {
  const [brandFilter, setBrandsFilter] = useState([])
  const [brandCodeFilter, setBrandCodeFilter] = useState([])
  const [voucherTableData, setvoucherTableData]: any = useState([])
  const [currencyFilter, setcurrencyFilter] = useState([])

  const getVoucherList = () => {
    setvoucherTableData([])
    InventoryService.voucherList()
      .then((response) => {
        setvoucherTableData(response)
      })
      .catch((error: any) => {
        ToasterService.show(error, CONSTANTS.ERROR)
      })
  }

  // const getBrandsFilterList = () => {
  //   new MasterService()
  //     .brandAndBrandCodeFilter()
  //     .then((response: any) => {
  //       setBrandsFilter(response.brands)
  //       setBrandCodeFilter(response.brandsCode)
  //     })
  //     .catch((error: any) => {
  //       return {}
  //     })
  // }

  // const getCountryList = () => {
  //   new MasterService()
  //     .countryAndCurencyList()
  //     .then((response: any) => {
  //       setcurrencyFilter(response?.currency)
  //     })
  //     .catch((error: any) => {
  //       ToasterService.show(error, CONSTANTS.ERROR)
  //     })
  // }

  useEffect(() => {
    getVoucherList()
    // getCountryList()
    // getBrandsFilterList()

    AuthService.brandsNameList$.subscribe((value: any) => {
      setBrandsFilter(value)
    })
    AuthService.brandsCodeList$.subscribe((value: any) => {
      setBrandCodeFilter(value)
    })
    AuthService.currencyList$.subscribe((value: any) => {
      setcurrencyFilter(value)
    })
  }, [])

  const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip)

  const brandBody = (rowData: any) => {
    if (rowData?.brandName && rowData?.logo) {
      return (
        <div className="ctmtbltd">
          <HtmlTooltip
            title={
              <React.Fragment>
                <img
                  crossOrigin="anonymous"
                  src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.logo}`}
                  style={{ verticalAlign: 'middle', paddingRight: '2px' }}
                  width={150}
                  alt="Brand Logo"
                />
              </React.Fragment>
            }
          >
            <img
              crossOrigin="anonymous"
              src={`${process.env.REACT_APP_API_BASEURL}/${rowData?.logo}`}
              style={{ verticalAlign: 'middle', paddingRight: '2px' }}
              width={25}
              alt="Brand Logo"
            />
          </HtmlTooltip>
          <span>{rowData.brandName}</span>
        </div>
      )
    } else if (rowData?.brandName) {
      return (
        <div className="ctmtbltd">
          <span>{rowData?.brandName}</span>
        </div>
      )
    }
  }

  const denominationBody = (rowData: any) => {
    return rowData?.denomination?.toLocaleString('en-US')
  }

  const isRedeemedBody = (rowData: any) => {
    return (
      <>
        <span
          style={{
            color: rowData?.isRedeemed === 'Available' ? 'green' : 'red',
          }}
        >
          {rowData?.isRedeemed}
        </span>
      </>
    )
  }

  const isActiveBody = (rowData: any) => {
    return (
      <>
        <span
          style={{
            color: rowData?.isActive === 'Active' ? 'green' : 'red',
          }}
        >
          {rowData?.isActive}
        </span>
      </>
    )
  }

  const voucherTableColumns = [
    {
      label: 'Brand Name',
      fieldName: 'brandName',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandFilter?.map((brand: any) => {
          return brand.label
        }),
        fieldValue: 'brandName',
        changeFilter: true,
        placeholder: 'Brand Name',
      },
      padding: '8px', // width:'300px',
      body: brandBody,
    },

    {
      label: 'Brand Code',
      fieldName: 'brandCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: brandCodeFilter?.map((brand: any) => {
          return brand.label
        }),
        fieldValue: 'brandCode',
        changeFilter: true,
        placeholder: 'Brand Code',
      },
      padding: '8px', // width:'300px'
    },

    {
      label: 'Denomination',
      fieldName: 'denomination',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
      body: denominationBody,
    },

    {
      label: 'Currency',
      fieldName: 'currencyCode',
      textAlign: 'left',
      sort: true,
      filter: true,
      dropDownFilter: {
        filterOptions: currencyFilter?.map((country: any) => {
          return country.label
        }),
        fieldValue: 'currency',
        changeFilter: true,
        placeholder: 'Currency',
      },
      padding: '8px', // width:'300px'
    },

    {
      label: 'Expiry Date',
      fieldName: 'expiryDate',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },
    {
      label: 'Coupon Status',
      fieldName: 'isActive',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
      body: isActiveBody,
    },

    {
      label: 'Redeem Status',
      fieldName: 'isRedeemed',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
      body: isRedeemedBody,
    },
    {
      label: 'Uploaded Date',
      fieldName: 'createdAt',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Uploaded By',
      fieldName: 'createdBy',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Invoice Number',
      fieldName: 'invoiceNumber',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },

    {
      label: 'Type',
      fieldName: 'voucherType',
      width: '140px',
      frozen: false,
      sort: true,
      padding: '5px 0px 5px 10px',
      textAlign: 'left',
      filter: true,
    },
  ]

  return (
    <>
      <DataTableBasicDemo
        data={voucherTableData}
        column={voucherTableColumns}
        showGridlines={true}
        resizableColumns={true}
        rows={20}
        paginator={true}
        sortable={true}
        headerRequired={true}
        downloadedfileName={'Voucher'}
        scrollHeight={'calc(100vh - 70px)'}
      />
    </>
  )
}
export default AllCoupons
