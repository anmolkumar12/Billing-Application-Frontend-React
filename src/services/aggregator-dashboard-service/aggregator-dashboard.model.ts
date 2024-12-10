import moment from 'moment'

export class AggregatorDashboardModel {
  // modifyAggregatorDashboardData = (data: any) => {
  //   data[0].tabularData.forEach((element: any) => {
  //     element.availableAmount =
  //       element?.availableAmount?.toLocaleString('en-US')
  //     element.totalCreditedAmount =
  //       element?.totalCreditedAmount?.toLocaleString('en-US')
  //     element.totalRedeemedAmount =
  //       element?.totalRedeemedAmount?.toLocaleString('en-US')
  //     element.totalCommission =
  //       element?.totalCommission?.toLocaleString('en-US')
  //   })
  //   return data
  // }

  aggregatorRedeemedCouponsData = (data: any) => {
    data.forEach((element: any) => {
      element.createdAt = moment(element?.createdAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.deliveredAt = moment(element?.deliveredAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.emailDeliveredAt = moment(element?.emailDeliveredAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
      element.smsDeliveredAt = moment(element?.smsDeliveredAt).format(
        'YYYY-MM-DD HH:MM:SS'
      )
    })
    return data
  }

  modifyRechargedata = (data: any) => {
    data.forEach((element: any) => {
      // element.creditAmount = element?.creditAmount?.toLocaleString('en-US')
      element.createdAt =
        element?.createdAt &&
        moment(element?.createdAt).format('YYYY-MM-DD HH:MM:SS')
      element.description = element?.description?.replace(/(<([^>]+)>)/gi, '')
    })
    return data
  }

  modifySelectedClientWalletDetails = (data: any) => {
    data.forEach((element: any, index: number) => {
      element.label = `${element.clientName}(${element?.walletName})`
      element.value = index + 1
    })
    return data
  }
}
