import moment from 'moment'
export class CouponHistoryModel {
  // modifyBrandWiseReportData = (data: any) => {
  //   data.forEach((element: any) => {
  //     element.procuredAmount = element?.procuredAmount?.toLocaleString('en-US')
  //     element.procuredCount = element?.procuredCount?.toLocaleString('en-US')
  //     element.redeemedAmount = element?.redeemedAmount?.toLocaleString('en-US')
  //     element.redeemedCount = element?.redeemedCount?.toLocaleString('en-US')
  //     element.avilableAmount = element?.avilableAmount?.toLocaleString('en-US')
  //     element.avilableCount = element?.avilableCount?.toLocaleString('en-US')
  //     element.expireIn30dDaysAmount =
  //       element?.expireIn30dDaysAmount?.toLocaleString('en-US')
  //     element.expireIn30dDaysCount =
  //       element?.expireIn30dDaysCount?.toLocaleString('en-US')
  //   })
  //   return data
  // }

  // modifyDenomWiseReportData = (data: any) => {
  //   data.forEach((element: any) => {
  //     element.denomination = element?.denomination?.toLocaleString('en-US')
  //     element.procuredAmount = element?.procuredAmount?.toLocaleString('en-US')
  //     element.procuredCount = element?.procuredCount?.toLocaleString('en-US')
  //     element.redeemedAmount = element?.redeemedAmount?.toLocaleString('en-US')
  //     element.redeemedCount = element?.redeemedCount?.toLocaleString('en-US')
  //     element.avilableAmount = element?.avilableAmount?.toLocaleString('en-US')
  //     element.avilableCount = element?.avilableCount?.toLocaleString('en-US')
  //     element.expireIn30dDaysAmount =
  //       element?.expireIn30dDaysAmount?.toLocaleString('en-US')
  //     element.expireIn30dDaysCount =
  //       element?.expireIn30dDaysCount?.toLocaleString('en-US')
  //   })
  //   return data
  // }

  modifyRedeemedCoupon = (data: any) => {
    data.forEach((element: any) => {
      element.createdAt =
        element?.createdAt &&
        moment(element?.createdAt).format('YYYY-MM-DD HH:MM:SS')
      element.updatedAt =
        element?.updatedAt &&
        moment(element?.updatedAt).format('YYYY-MM-DD HH:MM:SS')
      element.deliveredAt =
        element?.deliveredAt &&
        moment(element?.deliveredAt).format('YYYY-MM-DD HH:MM:SS')
      element.smsDeliveredAt =
        element?.smsDeliveredAt &&
        moment(element?.smsDeliveredAt).format('YYYY-MM-DD HH:MM:SS')
      element.emailDeliveredOn =
        element?.emailDeliveredAt && moment().format('YYYY-MM-DD HH:MM:SS')
      // element.amountCharged = element?.amountCharged?.toLocaleString('en-US')
      // element.denomination = element?.denomination?.toLocaleString('en-US')
      // element.orderDiscount = element?.orderDiscount?.toLocaleString('en-US')
      // element.orderTotal = element?.orderTotal?.toLocaleString('en-US')
    })
    return data
  }

  modifyFailedTransactionData = (data: any) => {
    data.forEach((element: any) => {
      element.orderAt =
        element?.orderAt &&
        moment(element?.orderAt).format('YYYY-MM-DD HH:MM:SS')
      // element.denomination = element?.denomination?.toLocaleString('en-US')
      // element.quantity = element?.quantity?.toLocaleString('en-US')
    })
    return data
  }
}
