import moment from 'moment'

export class AggregatorReportModel {
  aggregatorRedeemedCouponsData = (data: any) => {
    // console.log(data, 'dataaaaaaa')
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
}
