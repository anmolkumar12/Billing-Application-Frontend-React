import moment from 'moment'

export class GenerateInvoiceModel {
  modifyInvoiceTableData = (data: any) => {
    data.forEach((item: any) => {
      item.paymentDate =
        item?.paymentDate && moment(item?.paymentDate).format('YYYY-MM-DD')
    })
    return data
  }
}
