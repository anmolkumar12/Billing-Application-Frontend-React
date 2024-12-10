import moment from 'moment'
export class PaymentsModel {
  paymentDataModification = (data: any) => {
    data.forEach((element: any) => {
      element.uploadedDate =
        element?.uploadedDate &&
        moment(element?.uploadedDate).format('YYYY-MM-DD')
      element.purchaseDate =
        element?.purchaseDate &&
        moment(element?.purchaseDate).format('YYYY-MM-DD')
      // element.brandLogo = process.env.REACT_APP_API_BASEURL + element.brandLogo
      // element.amountActualPaid =
      //   element?.amountActualPaid?.toLocaleString('en-US')
      // element.availableAmount =
      //   element?.availableAmount?.toLocaleString('en-US')
      // element.couponCount = element?.couponCount?.toLocaleString('en-US')
      // element.couponPurchaseAmount =
      //   element?.couponPurchaseAmount?.toLocaleString('en-US')
      // element.couponUploadedAmount =
      //   (+element?.couponUploadedAmount)?.toLocaleString('en-US')
      // element.commissionEarned =
      //   element?.commissionEarned?.toLocaleString('en-US')
      // element.uploadCouponCount =
      //   element?.uploadCouponCount?.toLocaleString('en-US')
    })
    return data
  }
  paymentVoucherModification = (data: any) => {
    data.forEach((element: any) => {
      element.updatedAt =
        element?.updatedAt &&
        moment(element?.updatedAt).format('YYYY-MM-DD HH:MM:SS')
      element.expiryDate =
        element?.expiryDate &&
        moment(element?.expiryDate).format('YYYY-MM-DD HH:MM:SS')
      element.createdAt =
        element?.createdAt &&
        moment(element?.createdAt).format('YYYY-MM-DD HH:MM:SS')
      element.redeemStatus = element.isRedeemed == 1 ? 'Used' : 'Available'
      element.activeStatus = element.isActive == 1 ? 'Active' : 'Non-Active'
      // element.amountActualPaid =
      //   element?.amountActualPaid?.toLocaleString('en-US')
      // element.couponPurchaseAmount =
      //   element?.couponPurchaseAmount?.toLocaleString('en-US')
      // element.commissionEarned =
      //   element?.commissionEarned?.toLocaleString('en-US')
      // element.couponCount = element?.couponCount?.toLocaleString('en-US')
      // element.availableAmount =
      //   element?.availableAmount?.toLocaleString('en-US')
      // element.couponUploadedAmount =
      //   (+element?.couponUploadedAmount)?.toLocaleString('en-US')
    })
    return data
  }
}
