import moment from 'moment'

export class AggregatorAnalyticsModel {
  aggregatorPaymentData = (data: any) => {
    data.forEach((element: any) => {
      element.createdAt =
        element?.createdAt &&
        moment(element?.createdAt).format('YYYY-MM-DD HH:MM:SS')

      // element.creditAmount = element?.creditAmount?.toLocaleString('en-US')
      // element.availableAmount =
      //   element?.availableAmount?.toLocaleString('en-US')
      // element.totalCreditedAmount =
      //   element?.totalCreditedAmount?.toLocaleString('en-US')
      // element.totalRedeemedAmount =
      //   element?.totalRedeemedAmount?.toLocaleString('en-US')
      // element.totalCommission =
      //   element?.totalCommission?.toLocaleString('en-US')
    })
    return data
  }

  clientDashboardData = (data: any) => {
    data?.tabularData.forEach((element: any) => {
      // element.totalAvailableAmount =
      //   element?.totalAvailableAmount?.toLocaleString('en-US')
      // element.totalCreditedAmount =
      //   element?.totalCreditedAmount?.toLocaleString('en-US')
      // element.totalRedeemedAmount =
      //   element?.totalRedeemedAmount?.toLocaleString('en-US')
      // element.totalCommission =
      //   element?.totalCommission?.toLocaleString('en-US')
    })
    return data
  }

  modifyWalletInfoData = (data: any) => {
    data.forEach((element: any, index: number) => {
      // element.availableAmount =
      //   element?.availableAmount?.toLocaleString('en-US')
      // element.creditAmount = element?.creditAmount?.toLocaleString('en-US')
      // element.totalRedeemedAmount =
      //   element?.totalRedeemedAmount?.toLocaleString('en-US')

      element.uploadedDate = moment(element?.uploadedDate).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.label = `${element.clientName}(${element.walletName})`
      element.value = index
    })
    return data
  }

  modifyClientInfoData = (data: any) => {
    data.forEach((element: any) => {
      // element.availableAmount =
      //   element?.availableAmount?.toLocaleString('en-US')
      // element.creditAmount = element?.creditAmount?.toLocaleString('en-US')
      // element.totalRedeemedAmount =
      //   element?.totalRedeemedAmount?.toLocaleString('en-US')
      element.emailDeliveredAt = moment(element?.emailDeliveredAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.smsDeliveredAt = moment(element?.smsDeliveredAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.deliveredAt = moment(element.deliveredAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.createdAt = moment(element.createdAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.purchaseDate = moment(element.purchaseDate).format('YYYY-MM-DD')
      element.label = element?.clientName
      element.value = element?.clientId
    })
    return data
  }

  modifyRechargeRequestData = (data: any) => {
    data.forEach((element: any) => {
      element.createdAt = moment(element.createdAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
    })
    return data
  }

  modifyInvoiceNumberList = (data: any) => {
    data.forEach((element: any) => {
      element.label = element.invoiceNumber
      element.value = element?.invoiceId.toString()
    })
    return data
  }

  // TODO: To set the options in Client Filter after getting the API

  // clientFilter = (data: any) => {
  //   data.forEach((element: any) => {
  //     element.value = element?.id.toString()
  //     element.label = element?.name
  //   })
  //   return data
  // }
}
