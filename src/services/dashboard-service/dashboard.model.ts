import moment from 'moment'

export class DashboardModel {
  modifiyDashBoardData = (data: any) => {
    this.modifyProcuredCouponListTableData(
      data?.couponResult?.procuredCouponList
    )
    this.modifyBrandDenominationWiseTableData(
      data?.couponResult?.brandDenominationWise
    )
    this.modifyExpiringSoonTableData(data?.couponResult?.brandExpiryWise)

    if (data?.couponResult?.brandDenominationWise?.length > 20) {
      data.couponResult.brandCouponDenominationWise =
        data?.couponResult?.brandDenominationWise?.splice(0, 20)
    }
    return data
  }

  modifyBrandDenominationWiseTableData = (data: any) => {
    data.forEach((item: any) => {
      // item.avilableAmount = item?.avilableAmount?.toLocaleString('en-US')
      // item.avilableCount = item?.avilableCount?.toLocaleString('en-US')
      // item.denomination = item?.denomination?.toLocaleString('en-US')
      // item.expireIn30dDaysAmount =
      //   item?.expireIn30dDaysAmount?.toLocaleString('en-US')
      // item.expireIn30dDaysCount =
      //   item?.expireIn30dDaysCount?.toLocaleString('en-US')
      // item.procuredAmount = item?.procuredAmount?.toLocaleString('en-US')
      // item.procuredCount = item?.procuredCount?.toLocaleString('en-US')
      // item.redeemedAmount = item?.redeemedAmount?.toLocaleString('en-US')
      // item.redeemedCount = item?.redeemedCount?.toLocaleString('en-US')
    })
  }

  modifyProcuredCouponListTableData = (data: any) => {
    data.forEach((item: any) => {
      item['paymentDate'] = item['paymentDate']
        ? moment(item['paymentDate']).format('YYYY-MM-DD')
        : ''

      // item.couponAmount = item.couponAmount
      //   ? item.couponAmount.toLocaleString('en-US')
      //   : 0
      // item.couponCount = item.couponCount
      //   ? item.couponCount.toLocaleString('en-US')
      //   : 0
      // item.discount = item.discount ? item.discount.toLocaleString('en-US') : 0
    })
  }

  modifyExpiringSoonTableData = (data: any) => {
    data.forEach((item: any) => {
      // item.couponAmount = item.couponAmount
      //   ? item.couponAmount.toLocaleString('en-US')
      //   : 0
      // item.expiryDate = moment(item?.expiryDate).format('l')
      item['expiryDate'] = item['expiryDate']
        ? moment(item['expiryDate']).format('YYYY-MM-DD')
        : ''
      // item.couponCount = item.couponCount
      //   ? item.couponCount.toLocaleString('en-US')
      //   : 0
    })
  }
}
