import moment from 'moment'

export class ManageStoreModel {
  modifyStoreRechargeTableData = (data: any) => {
    data.forEach((element: any) => {
      element.createdAt =
        element?.createdAt && moment(element?.createdAt).format('YYYY-MM-DD')
      element.paymentDate =
        element?.paymentDate &&
        moment(element?.paymentDate).format('YYYY-MM-DD')
    })
    return data
  }
}
