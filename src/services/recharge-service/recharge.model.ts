import moment from 'moment'

export class RechargeModel {
  modifyRechargedata = (data: any) => {
    data.forEach((element: any) => {
      // element.creditAmount = element?.creditAmount?.toLocaleString('en-US')
      element.createdAt =
        element?.createdAt &&
        moment(element?.createdAt).format('YYYY-MM-DD HH:MM:SS')
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

  modifyPendingInvoiceData = (data: any) => {
    data.forEach((element: any) => {
      element.paymentDate =
        element?.paymentDate &&
        moment(element?.paymentDate).format('YYYY-MM-DD HH:MM:SS')
    })
    return data
  }
}
